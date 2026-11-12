import type { ReactNode } from 'react';
import BootSequence from '@/components/BootSequence';
import DesktopProvider from '@/components/desktop/DesktopProvider';
import Taskbar from '@/components/desktop/Taskbar';
import DesktopExperienceFrame from '@/components/desktop/DesktopExperienceFrame';

/** Chrome belongs to HTML routes, never to the outer 3D scene. */
export default function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <DesktopExperienceFrame>
      <noscript>
        <style>{`
          .reveal { opacity: 1 !important; transform: none !important; }
          .desk-root { position: static !important; overflow: visible !important; padding-bottom: 4rem; }
          .desk-icons { display: none !important; }
          .taskbar button[aria-controls] { display: none !important; }
          .section-navigation { display: flex !important; position: static !important; overflow-x: auto !important; min-width: 0; flex: 1; padding: 0.25rem; }
          .mobile-experience-note button { display: none !important; }
          .desk-window { display: flex !important; position: static !important; transform: none !important; margin: 0.75rem; width: auto !important; height: auto !important; max-height: none !important; }
        `}</style>
      </noscript>
      <div className="theme-screen contents font-mono"><BootSequence /></div>
      <DesktopProvider>{children}<Taskbar /></DesktopProvider>
    </DesktopExperienceFrame>
  );
}
