'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Monitor, X } from 'lucide-react';

const STORAGE_KEY = 'desktop-experience-note-dismissed';

export default function DesktopExperienceFrame({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try { setDismissed(sessionStorage.getItem(STORAGE_KEY) === '1'); } catch {}
  }, []);
  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };
  return (
    <div className={`desktop-shell ${dismissed ? '' : 'desktop-note-visible'}`}>
      {!dismissed && (
        <aside aria-label="Desktop experience" className="mobile-experience-note fixed inset-x-0 top-0 z-[85] h-12 bg-bg text-body hidden items-center gap-2 border-b border-line px-3 text-xs">
          <Monitor aria-hidden="true" className="w-4 h-4 shrink-0" />
          <p className="flex-1">Open on a desktop for the full 3D experience.</p>
          <button type="button" onClick={dismiss} aria-label="Dismiss desktop experience note" className="btn !p-1.5 shrink-0"><X aria-hidden="true" className="w-4 h-4" /></button>
        </aside>
      )}
      {children}
    </div>
  );
}
