'use client';

import { useCallback, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audio } from '@/lib/audio';

/*
 * On by default. Browsers will not let audio start before a gesture, so the
 * engine arms itself and becomes audible at the visitor's first click or
 * keypress; the button reports intent, which is the honest thing to show
 * before that first interaction.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    audio.armAutoStart();
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
