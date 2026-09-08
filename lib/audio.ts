/*
 * One Web Audio graph for the whole site: the ambient machine room plus the
 * short effects (key clicks, window open/close, the boot surge). A single
 * shared context because browsers cap how many a page may hold, and because
 * one master gain should mute everything at once.
 *
 * Nothing is downloaded — every sound is synthesised, so the texture can
 * drift instead of looping audibly and there is no audio payload to fetch.
 *
 * Everything is gated on `unlocked`. An AudioContext created before the
 * visitor's first gesture starts suspended, and a suspended context's clock
 * does not advance — so anything scheduled against it queues at t=0 and then
 * fires all at once the moment the context resumes. Refusing to schedule
 * until the context is genuinely running is what keeps that pile-up from
 * landing on the first click.
 */

type Listener = (on: boolean) => void;

const AMBIENT_GAIN = 0.05;

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: GainNode | null = null;
  private stopAmbient: (() => void) | null = null;
  private listeners = new Set<Listener>();
  private armed = false;
  /** True only once the context is actually running and safe to schedule on. */
  private unlocked = false;
  private unlockCallbacks = new Set<() => void>();

  /** New visitors are silent until they explicitly use the sound toggle. */
  enabled = false;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.enabled));
  }

  /**
   * Runs once the context is live. Callers that want to make a sound before
   * any gesture has happened register here instead of firing into a
   * suspended context, where the sound would queue and then land late.
   */
  onUnlock(callback: () => void) {
    if (this.unlocked) {
      callback();
      return () => {};
    }
    this.unlockCallbacks.add(callback);
    return () => this.unlockCallbacks.delete(callback);
  }

  /** Compatibility hook for explicit callers; the UI does not auto-arm it. */
  armAutoStart() {
    if (this.armed || typeof window === 'undefined') return;
    this.armed = true;

    const start = () => {
      void this.unlock();
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };

    window.addEventListener('pointerdown', start);
    window.addEventListener('keydown', start);
  }

  /**
   * Creates the context if needed, resumes it, and only then starts the
   * ambient bed. Nothing is scheduled before the resume resolves.
   */
  private async unlock(): Promise<void> {
    if (typeof window === 'undefined' || this.unlocked) return;

    if (!this.context) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;

      const context = new Ctor();
      const master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      this.context = context;
      this.master = master;
    }

    try {
      await this.context.resume();
    } catch {
      return; // Gesture was not enough for this browser; try again on the next one.
    }
    if (this.context.state !== 'running') return;

    this.unlocked = true;

    // Fade up rather than snapping on, now that the clock is actually moving.
    if (this.master) {
      const now = this.context.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(0, now);
      this.master.gain.linearRampToValueAtTime(this.enabled ? 1 : 0, now + 1.2);
    }

    this.startAmbient();

    const callbacks = [...this.unlockCallbacks];
    this.unlockCallbacks.clear();
    callbacks.forEach((callback) => callback());
  }

  /** The context, but only when it is safe to schedule against. */
  private live(): AudioContext | null {
    if (!this.unlocked || !this.enabled) return null;
    if (!this.context || this.context.state !== 'running') return null;
    return this.context;
  }

  private startAmbient() {
    const context = this.context;
    const master = this.master;
    if (!context || !master || this.stopAmbient) return;

    const bed = context.createGain();
    bed.gain.setValueAtTime(0, context.currentTime);
    bed.gain.linearRampToValueAtTime(AMBIENT_GAIN, context.currentTime + 2.5);
    bed.connect(master);
    this.ambient = bed;

    // Two detuned low oscillators: the room tone.
    const hums = [55, 82.5].map((frequency, i) => {
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      const gain = context.createGain();
      gain.gain.value = i === 0 ? 0.5 : 0.18;
      osc.connect(gain).connect(bed);
      osc.start();
      return osc;
    });

    // Low-passed white noise: fans and air.
    const noise = context.createBufferSource();
    noise.buffer = this.noiseBuffer(2);
    noise.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.07;
    noise.connect(filter).connect(noiseGain).connect(bed);
    noise.start();

    // Blips on an uneven schedule, so the room sounds busy rather than idle.
    let timer: ReturnType<typeof setTimeout>;
    const blip = () => {
      this.tone({
        frequency: 420 + Math.random() * 1500,
        type: Math.random() > 0.5 ? 'square' : 'triangle',
        gain: 0.05,
        decay: 0.05 + Math.random() * 0.08,
        target: bed,
      });
      timer = setTimeout(blip, 400 + Math.random() * 2600);
    };
    timer = setTimeout(blip, 800);

    this.stopAmbient = () => {
      clearTimeout(timer);
      hums.forEach((osc) => osc.stop());
      noise.stop();
    };
  }

  private noiseBuffer(seconds: number) {
    const context = this.context!;
    const frames = Math.floor(context.sampleRate * seconds);
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) channel[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /** One short shaped tone. The building block for every effect below. */
  private tone({
    frequency,
    type = 'square',
    gain = 0.06,
    decay = 0.06,
    attack = 0.004,
    target,
  }: {
    frequency: number;
    type?: OscillatorType;
    gain?: number;
    decay?: number;
    attack?: number;
    target?: AudioNode;
  }) {
    const context = this.live();
    const destination = target ?? this.master;
    if (!context || !destination) return;

    const osc = context.createOscillator();
    const envelope = context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;

    const now = context.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(gain, now + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

    osc.connect(envelope).connect(destination);
    osc.start(now);
    osc.stop(now + attack + decay + 0.05);
  }

  setEnabled(next: boolean) {
    this.enabled = next;
    this.emit();

    if (next) {
      // A toggle is itself a gesture, so this is a valid moment to unlock.
      void this.unlock().then(() => {
        if (this.context && this.master && this.context.state === 'running') {
          this.master.gain.setTargetAtTime(1, this.context.currentTime, 0.2);
        }
      });
    } else if (this.context && this.master) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.15);
    }
  }

  /** A keystroke in the prompt. Pitch varies so typing does not machine-gun. */
  key() {
    this.tone({ frequency: 1400 + Math.random() * 700, type: 'square', gain: 0.035, decay: 0.018 });
  }

  /** Enter, or any committing action. */
  click() {
    this.tone({ frequency: 900, type: 'square', gain: 0.05, decay: 0.035 });
    this.tone({ frequency: 1650, type: 'square', gain: 0.03, decay: 0.05 });
  }

  /** A window coming up: two rising notes. */
  open() {
    this.tone({ frequency: 620, gain: 0.03, decay: 0.05 });
    setTimeout(() => this.tone({ frequency: 980, gain: 0.03, decay: 0.07 }), 55);
  }

  /** A window going away: the same two notes, falling. */
  close() {
    this.tone({ frequency: 900, gain: 0.028, decay: 0.045 });
    setTimeout(() => this.tone({ frequency: 480, gain: 0.028, decay: 0.07 }), 55);
  }

  /**
   * Machine spin-up for the boot screen: a noise burst that opens up and
   * settles, plus a rising sweep — the sound of fans and drives coming on.
   */
  surge(seconds = 2.4) {
    const context = this.live();
    if (!context || !this.master) return;

    const now = context.currentTime;

    const noise = context.createBufferSource();
    noise.buffer = this.noiseBuffer(seconds);

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + seconds * 0.35);
    filter.frequency.exponentialRampToValueAtTime(500, now + seconds);

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.06, now + seconds);

    noise.connect(filter).connect(gain).connect(this.master);
    noise.start(now);
    noise.stop(now + seconds);

    // Drive spin-up underneath the noise.
    const sweep = context.createOscillator();
    const sweepGain = context.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(38, now);
    sweep.frequency.exponentialRampToValueAtTime(190, now + seconds * 0.7);
    sweepGain.gain.setValueAtTime(0.0001, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.08, now + 0.45);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    sweep.connect(sweepGain).connect(this.master);
    sweep.start(now);
    sweep.stop(now + seconds);
  }

  /** A service line landing during boot. */
  tick() {
    this.tone({ frequency: 2200 + Math.random() * 400, type: 'square', gain: 0.022, decay: 0.012 });
  }

  dispose() {
    this.stopAmbient?.();
    this.stopAmbient = null;
    void this.context?.close();
    this.context = null;
    this.master = null;
    this.ambient = null;
  }
}

export const audio = new AudioEngine();
