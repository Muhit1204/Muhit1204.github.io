'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import SoundToggle from '@/components/SoundToggle';
import { useDesktop } from '@/components/desktop/DesktopProvider';
import { WINDOWS, type WindowId } from '@/components/desktop/windows';
import DesktopIcon from '@/components/desktop/DesktopIcon';
import { SCENE_SIZE_QUERY } from '@/lib/scene-routing';

/*
 * The bar along the bottom of every route. It is the site navigation: one
 * labelled button per section, pressed while that window is open, so a reader
 * never has to hunt for an icon to find the publications. Phones use a
 * labelled menu so every section is visible without horizontal scrolling. The desktop icons
 * hold only what is not here (globe, terminal, hobbies, resume), so nothing
 * is listed twice.
 *
 * On /desktop the buttons are plain `#id` links, which DesktopProvider
 * turns into "open that window". Elsewhere they are links back to the desktop
 * that also open the window before the route changes.
 */

function Clock() {
  // Rendered after mount only: the server has no idea what time it is here.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="bevel-sunken hidden md:inline-flex items-center px-3 h-8 text-xs tabular-nums min-w-[4.5rem] justify-center">
      {now ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
    </span>
  );
}

/** The outer scene already has its own camera control; standalone HTML needs a return route. */
function DeskReturn() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (window.self !== window.top) return;
    const size = window.matchMedia(SCENE_SIZE_QUERY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAvailable(size.matches && !reduced.matches);
    sync();
    size.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      size.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return available ? <Link href="/" prefetch={false} className="btn h-8 shrink-0">Back to desk</Link> : null;
}

export default function Taskbar() {
  const pathname = usePathname();
  const desktop = useDesktop();
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const resize = () => { if (wide.matches) setMenuOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    wide.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
      wide.removeEventListener('change', resize);
    };
  }, [menuOpen]);

  const selectSection = () => {
    setMenuOpen(false);
    if (menuOpen) menuButton.current?.focus();
  };
  const onHome = pathname === '/desktop' || pathname === '/desktop/';

  const entry = (id: WindowId, label: string, extra = '') => {
    const icon = WINDOWS.find((spec) => spec.id === id)!.icon;
    const pressed = onHome && desktop?.isOpen(id);
    const className = `btn h-8 shrink-0 ${pressed ? 'btn-pressed' : ''} ${extra}`;
    return onHome ? (
      <a key={id} href={`#${id}`} onClick={selectSection} className={className} aria-current={desktop?.top === id ? 'true' : undefined}>
        <DesktopIcon name={icon} size={18} className="shrink-0" />{label}
      </a>
    ) : (
      <Link key={id} href={`/desktop#${id}`} onClick={() => { desktop?.open(id); selectSection(); }} className={className}>
        <DesktopIcon name={icon} size={18} className="shrink-0" />{label}
      </Link>
    );
  };

  return (
    <header ref={barRef} className="taskbar fixed inset-x-0 bottom-0 z-[80] flex items-center gap-1.5">
      {entry('about', '~/muntasir', 'font-bold')}
      <span aria-hidden="true" className="hidden lg:block w-px shrink-0 self-stretch my-2 bg-[#808080] border-r border-white" />

      <button
        ref={menuButton}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="section-navigation"
        onClick={() => setMenuOpen((value) => !value)}
        className="btn h-9 ml-auto lg:hidden"
      >
        <Menu aria-hidden="true" className="w-4 h-4" />
        Sections
        <ChevronDown aria-hidden="true" className={`w-3 h-3 ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      <nav
        id="section-navigation"
        aria-label="Sections"
        className={`section-navigation ${menuOpen ? 'grid' : 'hidden'} lg:flex lg:flex-1 lg:min-w-0 lg:items-center lg:gap-1 lg:overflow-x-auto lg:py-1`}
      >
        {WINDOWS.filter((spec) => spec.nav && spec.id !== 'about').map((spec) => entry(spec.id, spec.nav as string))}
        <Link href="/education" prefetch={false} onClick={selectSection} className={`btn h-8 shrink-0 ${pathname.startsWith('/education') ? 'btn-pressed' : ''}`}>
          <DesktopIcon name="cap" size={18} className="shrink-0" />education
        </Link>
      </nav>

      <DeskReturn />
      <SoundToggle />
      <Clock />
    </header>
  );
}
