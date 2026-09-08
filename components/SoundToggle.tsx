'use client';

import { useCallback, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audio } from '@/lib/audio';

/*
 * Sound is opt-in: unrelated clicks and keypresses never start audio.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const unsubscribe = audio.subscribe(setOn);
    return () => {
      unsubscribe();
    };
  }, []);

  const toggle = useCallback(() => {
    audio.setEnabled(!audio.enabled);
    audio.click();
  }, []);

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
