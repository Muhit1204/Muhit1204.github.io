'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';

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
    <div className="max-w-2xl mx-auto py-10 md:py-20 space-y-6">
      <div className="border border-line bg-surface">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-line bg-surface-2 text-xs">
          <span className="text-danger">●</span>
          <span className="text-muted">muntasir@portfolio: {path || '/…'}</span>
        </div>

        <div className="p-5 md:p-7 space-y-5 text-sm">
          <p className="text-muted">
            <span className="text-accent">$ </span>
            cat {path || 'page'}
          </p>

          <p className="text-danger">cat: {path || 'that path'}: No such file or directory</p>

          <h1 className="text-2xl md:text-3xl font-bold text-body">404 — not found</h1>

          {moved ? (
            <p className="text-muted leading-relaxed">
              That section moved onto the single page. It now lives at{' '}
              <Link href={`/#${moved.id}`} className="text-accent">
                #{moved.id}
              </Link>
              .
            </p>
          ) : (
            <p className="text-muted leading-relaxed">
              The site is one page now. Everything is below, or reachable from the prompt in the hero.
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/#${section.id}`}
                className="px-3 py-2 border border-line text-xs text-muted hover:border-accent-dim hover:text-accent transition-colors"
              >
                {section.label}
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex px-4 py-2.5 border border-accent-dim text-accent hover:bg-accent/10 transition-colors"
          >
            cd ~
          </Link>
        </div>
      </div>
    </div>
  );
}
