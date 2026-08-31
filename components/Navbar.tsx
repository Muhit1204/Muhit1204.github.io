'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Linkedin, Mail, Menu, X, Download } from 'lucide-react';
import SoundToggle from '@/components/SoundToggle';

/*
 * The site is one page with anchors, so nav entries point at section ids.
 * From a sub-route a bare `#work` resolves against that route and does
 * nothing, hence the `/#work` form built in `hrefFor` below.
 */
const sectionLinks = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'publications', label: 'publications' },
  { id: 'contact', label: 'contact' },
];

const routeLinks = [{ href: '/education', label: 'education' }];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const onHome = pathname === '/';

  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  // Highlighting only means anything on the single scrolling page.
  const activeId = onHome ? active : null;

  // Scroll-spy: the topmost section intersecting the band below the header wins.
  useEffect(() => {
    if (!onHome) return;

    const sections = sectionLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-mono text-sm md:text-base font-bold text-body truncate">
          <span className="text-accent">~/</span>muntasir
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center gap-5 font-mono text-sm text-muted">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={hrefFor(link.id)}
                className={
                  activeId === link.id
                    ? 'text-accent transition-colors'
                    : 'hover:text-body transition-colors'
                }
              >
                {link.label}
              </a>
            ))}
            {routeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? 'text-accent transition-colors'
                    : 'hover:text-body transition-colors'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="w-px h-5 bg-line" />

          <SoundToggle />

          <div className="flex items-center gap-3 text-muted">
            <a href="https://github.com/Muhit1204" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-accent transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/mdmuntasirhossain98" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:mhossain54@lamar.edu" aria-label="Email" className="hover:text-accent transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-none border border-accent-dim text-accent hover:bg-accent/10 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            resume
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden text-muted hover:text-accent transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu. A hash link does not fire a route change, so the menu
          has to be closed explicitly on click. */}
      {isOpen && (
        <nav className="md:hidden border-t border-line bg-surface px-4 py-4 space-y-3 font-mono text-sm">
          {sectionLinks.map((link) => (
            <a
              key={link.id}
              href={hrefFor(link.id)}
              onClick={() => setIsOpen(false)}
              className="block text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          {routeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            download
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-none border border-accent-dim text-accent"
          >
            <Download className="w-4 h-4" />
            resume
          </a>
        </nav>
      )}
    </header>
  );
}
