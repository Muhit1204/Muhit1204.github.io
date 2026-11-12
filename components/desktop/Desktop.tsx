'use client';

import type { ReactNode } from 'react';
import DesktopIcon from '@/components/desktop/DesktopIcon';
import { InDesktopContext } from '@/components/desktop/DesktopProvider';
import { WINDOWS } from '@/components/desktop/windows';

/*
 * The desktop itself: the surface, the icons, and the layer the windows sit
 * in. It fills the viewport above the taskbar and never scrolls; each window
 * scrolls its own contents instead.
 *
 * The windows arrive as children, already rendered on the server, so all of
 * the site's text is in the HTML whether or not a window is open. The icons
 * are plain `#id` links; DesktopProvider turns a click on one into "open that
 * window", and without script they are still ordinary anchors.
 *
 * `overflow-clip`, not `hidden`: a hidden box can still be scrolled by
 * script or by a fragment link, which would slide the whole desktop.
 */
export default function Desktop({ children }: { children: ReactNode }) {
  return (
    <InDesktopContext.Provider value={true}>
      <div className="desk-root fixed inset-x-0 overflow-clip" style={{ top: 'var(--desktop-top-inset, 0px)', bottom: 'var(--taskbar-height)' }}>
        <nav
          aria-label="Desktop icons"
          className="desk-icons absolute inset-0 p-2 lg:p-3 grid grid-cols-4 content-start justify-items-center gap-1 lg:flex lg:flex-col lg:flex-wrap lg:content-start lg:items-start lg:w-fit"
        >
          {/* Only what the taskbar does not already offer: a section never
              appears both as a taskbar button and as an icon. */}
          {WINDOWS.filter((spec) => !spec.nav).map((spec) => (
            <a key={spec.id} href={`#${spec.id}`} className="desk-icon">
              <DesktopIcon name={spec.icon} />
              <span>{spec.file}</span>
            </a>
          ))}
          <a href="/resume.pdf" download className="desk-icon">
            <DesktopIcon name="pdf" />
            <span>resume.pdf</span>
          </a>
        </nav>

        {children}
      </div>
    </InDesktopContext.Provider>
  );
}
