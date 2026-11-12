'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import DesktopShell from '@/components/desktop/DesktopShell';

/*
 * The site used to have /experience, /projects, /publications and /contact as
 * their own routes. Those URLs are in browser histories and search results,
 * and GitHub Pages cannot redirect, so this page recognises them and points
 * at the anchor that replaced each one instead of leaving a dead end.
 */

const MOVED: Record<string, { id: string; label: string }> = {
  experience: { id: 'experience', label: 'Experience' },
  projects: { id: 'projects', label: 'Projects' },
  publications: { id: 'publications', label: 'Publications' },
  contact: { id: 'contact', label: 'Contact' },
  about: { id: 'about', label: 'About' },
  skills: { id: 'skills', label: 'Skills' },
};

const SECTIONS = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'publications', label: 'publications' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
];

/** The path is a browser-only fact; empty during the server render. */
const subscribe = () => () => {};

export default function NotFound() {
  const cache = useRef<string | null>(null);
  const getPath = useCallback(() => {
    if (cache.current === null) cache.current = window.location.pathname;
    return cache.current;
  }, []);
  const path = useSyncExternalStore(subscribe, getPath, () => '');

  const slug = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  const moved = MOVED[slug] ?? null;

  return (
    <DesktopShell><div className="max-w-2xl mx-auto px-2 pt-6 md:pt-16 pb-20">
      <div className="window desk-window">
        <div className="titlebar titlebar-active mb-[3px]">
          <span className="truncate">muntasir@portfolio: {path || '/…'}</span>
          <span className="titlebar-grip" aria-hidden="true" />
        </div>

        <div className="well space-y-5 text-sm">
          <p className="text-muted">
            <span className="text-accent">$ </span>
            cat {path || 'page'}
          </p>

          <p className="text-danger">cat: {path || 'that path'}: No such file or directory</p>

          <h1 className="text-2xl md:text-3xl font-bold text-body">404 — not found</h1>

          {moved ? (
            <p className="text-muted leading-relaxed">
              That section moved onto the single page. It now lives at{' '}
              <Link href={`/desktop#${moved.id}`} className="text-accent">
                #{moved.id}
              </Link>
              .
            </p>
          ) : (
            <p className="text-muted leading-relaxed">
              The site is one page now. Every section is a window on the desktop, reachable from the bar at the bottom.
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/desktop#${section.id}`}
                className="btn text-xs"
              >
                {section.label}
              </Link>
            ))}
          </div>

          <Link
            href="/desktop"
            className="btn font-bold !px-4 !py-2.5"
          >
            cd ~
          </Link>
        </div>
      </div>
    </div></DesktopShell>
  );
}
