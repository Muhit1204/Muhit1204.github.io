/*
 * One Web Audio graph for the whole site: the ambient machine room plus the
 * short effects (key clicks, window open/close, the boot surge). A single
 * shared context because browsers cap how many a page may hold, and because
 * one master gain should mute everything at once.
 *
 * Nothing is downloaded — every sound is synthesised, so the texture can
 * drift instead of looping audibly and there is no audio payload to fetch.
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

  /** Sound is on by default; autoplay policy decides when it becomes audible. */
  enabled = true;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.enabled));
  }

  /**
   * Browsers refuse to start audio before a gesture. Rather than showing the
   * toggle as off and lying about intent, the engine starts enabled and waits
   * here for the visitor's first interaction to actually make noise.
   */
  armAutoStart() {
    if (this.armed || typeof window === 'undefined') return;
    this.armed = true;

    const start = () => {
      if (this.enabled) this.ensure();
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };

    window.addEventListener('pointerdown', start, { once: false });
    window.addEventListener('keydown', start, { once: false });
  }

  /** Creates the context and ambient bed if they do not exist yet. */
  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.context) {
      void this.context.resume();
      return this.context;
    }

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    const context = new Ctor();
    const master = context.createGain();
    master.gain.value = this.enabled ? 1 : 0;
    master.connect(context.destination);

    this.context = context;
    this.master = master;
    this.startAmbient();
    void context.resume();
    return context;
  }

  private startAmbient() {
    const context = this.context;
    const master = this.master;
    if (!context || !master || this.stopAmbient) return;

    const bed = context.createGain();
    bed.gain.value = AMBIENT_GAIN;
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
    const context = this.context;
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

    if (next) {
      const context = this.ensure();
      if (context && this.master) {
        this.master.gain.setTargetAtTime(1, context.currentTime, 0.2);
      }
    } else if (this.context && this.master) {
      this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.15);
    }

    this.emit();
  }

  /** A keystroke in the prompt. Pitch varies so typing does not machine-gun. */
  key() {
    if (!this.enabled) return;
    this.ensure();
    this.tone({ frequency: 1400 + Math.random() * 700, type: 'square', gain: 0.035, decay: 0.018 });
  }

  /** Enter, or any committing action. */
  click() {
    if (!this.enabled) return;
    this.ensure();
    this.tone({ frequency: 900, type: 'square', gain: 0.05, decay: 0.035 });
    this.tone({ frequency: 1650, type: 'square', gain: 0.03, decay: 0.05 });
  }

  /** A window coming up: two rising notes. */
  open() {
    if (!this.enabled) return;
    const context = this.ensure();
    if (!context) return;
    this.tone({ frequency: 620, gain: 0.05, decay: 0.06 });
    setTimeout(() => this.tone({ frequency: 980, gain: 0.05, decay: 0.09 }), 55);
  }

  /** A window going away: the same two notes, falling. */
  close() {
    if (!this.enabled) return;
    const context = this.ensure();
    if (!context) return;
    this.tone({ frequency: 900, gain: 0.045, decay: 0.05 });
    setTimeout(() => this.tone({ frequency: 480, gain: 0.045, decay: 0.09 }), 55);
  }

  /**
   * Machine spin-up for the boot screen: a noise burst that opens up and
   * settles, plus a rising sweep — the sound of fans and drives coming on.
   */
  surge(seconds = 2.4) {
    if (!this.enabled) return;
    const context = this.ensure();
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
    gain.gain.exponentialRampToValueAtTime(0.32, now + 0.25);
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
    sweepGain.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    sweep.connect(sweepGain).connect(this.master);
    sweep.start(now);
    sweep.stop(now + seconds);
  }

  /** A service line landing during boot. */
  tick() {
    if (!this.enabled) return;
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
