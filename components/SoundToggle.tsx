'use client';

import { useCallback, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audio, type AudioStatus } from '@/lib/audio';

/*
 * Sound is opt-in: unrelated clicks and keypresses never start audio.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState<AudioStatus>('off');

  useEffect(() => {
    const sync = () => { setOn(audio.enabled); setStatus(audio.status); };
    sync();
    const unsubscribe = audio.subscribe(sync);
    return () => {
      unsubscribe();
    };
  }, []);

  const toggle = useCallback(() => {
    void audio.setEnabled(!audio.enabled);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={status === 'error' ? 'Input sounds failed to load. Click to retry.' : status === 'loading' ? 'Loading input sounds; click to cancel.' : 'Mouse and keyboard sounds'}
      className={`btn h-8 shrink-0 ${on ? 'btn-pressed' : ''}`}
    >
      {on ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      <span className="sr-only">{status === 'error' ? 'Retry input sounds' : on ? 'Mute input sounds' : 'Enable input sounds'}</span>
      <span aria-hidden="true" className="hidden lg:inline">
        {status === 'error' ? 'snd retry' : status === 'loading' ? 'snd …' : on ? 'snd on' : 'snd off'}
      </span>
    </button>
  );
}
