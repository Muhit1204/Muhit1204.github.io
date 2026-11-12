/* One opt-in graph for CC0 input samples. No synthesized ambience or tones.
 * Physical input is handled once so component callbacks never double-play it. */
type Listener = (on: boolean) => void;
export type AudioStatus = 'off' | 'loading' | 'ready' | 'error';
type Group = 'mouse' | 'key' | 'space' | 'shift';
type Edge = 'down' | 'up';
const FILES = (['mouse', 'key', 'space', 'shift'] as const).flatMap(group =>
  (['down', 'up'] as const).flatMap(edge => [1, 2, 3].map(i => `${group}-${edge}-${i}.wav`)));

export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading: Promise<Map<string, AudioBuffer>> | null = null;
  private voices = new Set<AudioBufferSourceNode>();
  private listeners = new Set<Listener>();
  private unlockCallbacks = new Set<() => void>();
  private keys = new Set<string>();
  private pointers = new Set<string>();
  private listening = false;
  private activation = 0;
  enabled = false;
  status: AudioStatus = 'off';

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  private emit() { this.listeners.forEach(listener => listener(this.enabled)); }
  onUnlock(callback: () => void) {
    if (this.enabled && this.context?.state === 'running') callback();
    else this.unlockCallbacks.add(callback);
    return () => { this.unlockCallbacks.delete(callback); };
  }
  private load(context: AudioContext) {
    if (!this.loading) {
      this.loading = Promise.all(FILES.map(async file => {
        const response = await fetch(`/sounds/${file}`);
        if (!response.ok) throw Error('Sample unavailable');
        const data = await response.arrayBuffer();
        if (data.byteLength > 64000) throw Error('Sample too large');
        const buffer = await context.decodeAudioData(data);
        if (buffer.duration > 0.15) throw Error('Sample too long');
        return [file, buffer] as const;
      })).then(entries => new Map(entries)).catch(error => {
        this.loading = null; // A later explicit toggle can retry.
        throw error;
      });
    }
    return this.loading;
  }
  async setEnabled(next: boolean): Promise<void> {
    const activation = ++this.activation;
    this.enabled = next;
    if (!next) {
      this.status = 'off'; this.detach(); this.stopVoices();
      if (this.context?.state === 'running') this.master?.gain.setValueAtTime(0, this.context.currentTime);
      this.emit(); return;
    }
    this.status = 'loading'; this.emit();
    try {
      if (typeof window === 'undefined') throw Error('Audio unavailable');
      if (!this.context) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) throw Error('Audio unavailable');
        this.context = new Ctor();
        this.master = this.context.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.context.destination);
      }
      const context = this.context;
      await context.resume();
      if (activation !== this.activation) return;
      if (context.state !== 'running') throw Error('Audio suspended');
      const callbacks = [...this.unlockCallbacks]; this.unlockCallbacks.clear();
      callbacks.forEach(callback => callback());
      // No fetch, decode or scheduling until the explicit unlock completes.
      const buffers = await this.load(context);
      if (activation !== this.activation || this.context !== context || !this.enabled) return;
      this.buffers = buffers;
      if (context.state !== 'running') throw Error('Audio suspended');
      this.master!.gain.setValueAtTime(0.3, context.currentTime);
      this.status = 'ready'; this.attach(); this.emit();
    } catch {
      if (activation !== this.activation) return;
      this.enabled = false; this.status = 'error';
      this.detach(); this.stopVoices(); this.emit();
    }
  }
  private play(group: Group, edge: Edge, rate = 1) {
    const context = this.context;
    if (!this.enabled || this.status !== 'ready' || !context || context.state !== 'running' || !this.master) return;
    const buffer = this.buffers.get(`${group}-${edge}-${Math.floor(Math.random() * 3) + 1}.wav`);
    if (!buffer) return; // Loading input is dropped, never queued.
    if (this.voices.size >= 16) {
      const oldest = this.voices.values().next().value;
      oldest?.stop(); if (oldest) this.voices.delete(oldest);
    }
    const voice = context.createBufferSource();
    const gain = context.createGain();
    voice.buffer = buffer;
    voice.playbackRate.value = rate * (0.97 + Math.random() * 0.06);
    gain.gain.value = 0.92 + Math.random() * 0.16;
    voice.connect(gain).connect(this.master);
    this.voices.add(voice);
    voice.onended = () => { this.voices.delete(voice); voice.disconnect(); gain.disconnect(); };
    voice.start(context.currentTime);
  }
  private group(event: KeyboardEvent): Group {
    return event.code === 'Space' ? 'space' : event.code.startsWith('Shift') ? 'shift' : 'key';
  }
  private keyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.isComposing || this.context?.state !== 'running') return;
    const key = event.code || event.key;
    if (this.keys.has(key)) return;
    this.keys.add(key);
    this.play(this.group(event), 'down', event.code === 'Space' ? 0.85 : 1);
  };
  private keyUp = (event: KeyboardEvent) => {
    if (!this.keys.delete(event.code || event.key)) return;
    this.play(this.group(event), 'up', event.code === 'Space' ? 0.85 : 1);
  };
  private pointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || ![0, 2].includes(event.button) || this.context?.state !== 'running') return;
    this.pointers.add(`${event.pointerId}:${event.button}`);
    this.play('mouse', 'down', event.button === 2 ? 0.92 : 1);
  };
  private pointerUp = (event: PointerEvent) => {
    if (!this.pointers.delete(`${event.pointerId}:${event.button}`)) return;
    this.play('mouse', 'up', event.button === 2 ? 0.92 : 1);
  };
  private resetPressed = () => { this.keys.clear(); this.pointers.clear(); };
  private attach() {
    if (this.listening) return;
    this.listening = true;
    window.addEventListener('pointerdown', this.pointerDown, true);
    window.addEventListener('pointerup', this.pointerUp, true);
    window.addEventListener('keydown', this.keyDown, true);
    window.addEventListener('keyup', this.keyUp, true);
    window.addEventListener('pointercancel', this.resetPressed, true);
    window.addEventListener('blur', this.resetPressed);
  }
  private detach() {
    if (this.listening) {
      window.removeEventListener('pointerdown', this.pointerDown, true);
      window.removeEventListener('pointerup', this.pointerUp, true);
      window.removeEventListener('keydown', this.keyDown, true);
      window.removeEventListener('keyup', this.keyUp, true);
      window.removeEventListener('pointercancel', this.resetPressed, true);
      window.removeEventListener('blur', this.resetPressed);
    }
    this.listening = false; this.resetPressed();
  }
  private stopVoices() { this.voices.forEach(voice => voice.stop()); this.voices.clear(); }
  // Preserve callers, especially the owner's untouched BootSequence. Only
  // physical input plays audio, so these former synthesis hooks are silent.
  key() {}
  click() {}
  open() {}
  close() {}
  surge() {}
  tick() {}
  dispose() {
    ++this.activation; this.detach(); this.stopVoices();
    void this.context?.close();
    this.context = null; this.master = null; this.buffers.clear(); this.loading = null;
    this.unlockCallbacks.clear(); this.enabled = false; this.status = 'off'; this.emit();
  }
}
export const audio = new AudioEngine();
