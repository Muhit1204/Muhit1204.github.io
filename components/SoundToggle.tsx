'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/*
 * Ambient machine room: a low hum, filtered noise for air, and occasional
 * blips and key clicks. Synthesised with Web Audio rather than shipped as an
 * audio file — no download, no decode, and the texture can drift instead of
 * looping audibly.
 *
 * Off by default and never started without a click. Browsers block autoplay,
 * and sound that arrives uninvited is worse than no sound — which is also why
 * the choice is not persisted: a remembered "on" could not be honoured on the
 * next load anyway, so storing it would only pretend to.
 */

const MASTER_GAIN = 0.05;

type Rig = {
  context: AudioContext;
  master: GainNode;
  stop: () => void;
};

function buildRig(): Rig | null {
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  const context = new Ctor();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  // Two detuned low oscillators: the room tone.
  const hums = [55, 82.5].map((frequency, i) => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    const gain = context.createGain();
    gain.gain.value = i === 0 ? 0.5 : 0.18;
    osc.connect(gain).connect(master);
    osc.start();
    return osc;
  });

  // Filtered white noise: fans and air.
  const frames = context.sampleRate * 2;
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) channel[i] = Math.random() * 2 - 1;

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 620;
  filter.Q.value = 0.6;

  const noiseGain = context.createGain();
  noiseGain.gain.value = 0.07;
  noise.connect(filter).connect(noiseGain).connect(master);
  noise.start();

  /* Blips: short square-wave pings on an uneven schedule, so the room sounds
     like it is doing something rather than idling. */
  let blipTimer: ReturnType<typeof setTimeout>;
  const blip = () => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = Math.random() > 0.5 ? 'square' : 'triangle';
    osc.frequency.value = 420 + Math.random() * 1500;

    const now = context.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05 + Math.random() * 0.08);

    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + 0.2);

    blipTimer = setTimeout(blip, 400 + Math.random() * 2600);
  };
  blipTimer = setTimeout(blip, 800);

  return {
    context,
    master,
    stop: () => {
      clearTimeout(blipTimer);
      hums.forEach((osc) => osc.stop());
      noise.stop();
      void context.close();
    },
  };
}

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const rigRef = useRef<Rig | null>(null);

  /*
   * Side effects stay out of the state updater: React may call an updater
   * more than once, and building the rig twice would leave a stray
   * AudioContext humming with nothing able to stop it.
   */
  const toggle = useCallback(() => {
    if (on) {
      const rig = rigRef.current;
      if (rig) {
        rig.master.gain.setTargetAtTime(0, rig.context.currentTime, 0.2);
        void rig.context.suspend();
      }
      setOn(false);
      return;
    }

    const rig = rigRef.current ?? buildRig();
    if (!rig) return; // No Web Audio; leave the button off.
    rigRef.current = rig;
    void rig.context.resume();
    rig.master.gain.setTargetAtTime(MASTER_GAIN, rig.context.currentTime, 0.4);
    setOn(true);
  }, [on]);

  useEffect(
    () => () => {
      rigRef.current?.stop();
      rigRef.current = null;
    },
    [],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title="Ambient machine sound"
      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {on ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4" />}
      <span className="sr-only">{on ? 'Mute ambient sound' : 'Play ambient sound'}</span>
      <span aria-hidden="true" className="hidden lg:inline">
        {on ? 'snd on' : 'snd off'}
      </span>
    </button>
  );
}
