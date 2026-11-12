'use client';

import { useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { InDesktopContext, useDesktop } from '@/components/desktop/DesktopProvider';
import { windowSpec, type WindowId } from '@/components/desktop/windows';
import DesktopIcon from '@/components/desktop/DesktopIcon';

/*
 * One window. On the desktop it opens, closes, stacks, drags by its title
 * bar and maximizes; on a phone it always fills the screen. Used outside the
 * desktop (the /education route) the same frame renders as a static window
 * in the page flow, so both routes share one look.
 *
 * A closed window stays in the document and is only hidden with CSS. That
 * keeps every section in the HTML for search engines and for readers with
 * scripting off, and it keeps a window's scroll position and any open
 * <details> exactly as they were when it is reopened.
 */

const CASCADE_X = 28;
const CASCADE_Y = 18;
const DRAG_QUERY = '(min-width: 1024px)';

export default function DesktopWindow({
  id,
  title,
  screen = false,
  footer,
  children,
}: {
  /** A window id from the registry on the desktop; any anchor id elsewhere. */
  id: string;
  title: string;
  /** Black CRT body (terminal, constellation) instead of a white well. */
  screen?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const desktop = useDesktop();
  const managed = useContext(InDesktopContext) && desktop !== null;

  const spec = managed ? windowSpec(id as WindowId) : null;
  const cascade = spec?.cascade ?? 0;

  const [offset, setOffset] = useState({ x: cascade * CASCADE_X, y: cascade * CASCADE_Y });
  const [maximized, setMaximized] = useState(false);
  const [draggable, setDraggable] = useState(false);
  const frameRef = useRef<HTMLElement>(null);
  const drag = useRef<{ startX: number; startY: number; originX: number; originY: number; left: number; top: number; width: number } | null>(null);

  useEffect(() => {
    if (!managed) return;
    const query = window.matchMedia(DRAG_QUERY);
    const sync = () => setDraggable(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [managed]);

  // Cascade offsets and a resized desktop must not strand the window controls
  // beyond the clipped desktop. Keep each frame inside the available area;
  // dragging still uses its own, more permissive title-bar clamp below.
  useEffect(() => {
    const frame = frameRef.current;
    const area = frame?.parentElement;
    if (!managed || !draggable || maximized || !frame || !area) return;

    const fit = () => {
      const bounds = area.getBoundingClientRect();
      const rect = frame.getBoundingClientRect();
      const dx = Math.max(bounds.left - rect.left, Math.min(0, bounds.right - rect.right));
      const dy = Math.max(bounds.top - rect.top, Math.min(0, bounds.bottom - rect.bottom));
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      setOffset((current) => ({ x: current.x + dx, y: current.y + dy }));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(area);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [managed, draggable, maximized]);

  const body = (
    <div
      className={
        screen
          ? 'theme-screen font-mono bevel-sunken flex-1 min-h-0 overflow-hidden flex flex-col p-[2px]'
          : 'well flex-1 min-h-0 overflow-y-auto overscroll-contain'
      }
    >
      {children}
    </div>
  );

  const status = footer && (
    <div className="flex items-center gap-3 px-2 pt-1.5 pb-0.5 font-mono text-[0.65rem] text-body shrink-0">{footer}</div>
  );

  if (!managed || !desktop || !spec) {
    return (
      <section id={id} aria-label={title} className="window flex flex-col">
        <div className="titlebar mb-[3px]">
          <DesktopIcon name={id === 'education' ? 'cap' : 'doc'} size={20} className="shrink-0" />
          <span className="truncate">{title}</span>
          <span className="titlebar-grip" aria-hidden="true" />
        </div>
        {body}
        {status}
      </section>
    );
  }

  // On the desktop the title bar carries the same file name as the icon and
  // the taskbar entry, so a reader can match the three at a glance.
  const label = spec.file === title || screen ? title : spec.file;
  const open = desktop.isOpen(spec.id);
  const focused = desktop.top === spec.id;
  const canDrag = draggable && !maximized;

  /* Dragging by the title bar. Pointer capture keeps the moves coming when
     the cursor outruns the bar; the clamp keeps the bar reachable. */
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canDrag || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button, a')) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const area = frameRef.current?.parentElement?.getBoundingClientRect();
    let dx = event.clientX - state.startX;
    let dy = event.clientY - state.startY;
    if (area) {
      const keep = 96;
      dx = Math.min(Math.max(dx, area.left - state.left - state.width + keep), area.right - state.left - keep);
      dy = Math.min(Math.max(dy, area.top - state.top), area.bottom - state.top - 36);
    }
    setOffset({ x: state.originX + dx, y: state.originY + dy });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
  };

  const frame = maximized ? 'lg:inset-0' : `lg:inset-auto ${spec.frame}`;

  return (
    <section
      ref={frameRef}
      id={spec.id}
      aria-label={label}
      onPointerDownCapture={() => desktop.open(spec.id)}
      onFocusCapture={() => desktop.open(spec.id)}
      style={{
        zIndex: 10 + Math.max(desktop.order.indexOf(spec.id), 0),
        transform: canDrag ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
      }}
      className={`desk-window window absolute inset-0 flex-col ${frame} ${open ? 'flex' : 'hidden'}`}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(event) => {
          if (draggable && !(event.target as HTMLElement).closest('button, a')) setMaximized((value) => !value);
        }}
        className={`titlebar mb-[3px] shrink-0 ${focused ? 'titlebar-active' : ''} ${canDrag ? 'cursor-move touch-none' : ''}`}
      >
        <DesktopIcon name={spec.icon} size={20} className="shrink-0" />
        <span className="truncate">{label}</span>
        <span className="titlebar-grip" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setMaximized((value) => !value)}
          aria-label={maximized ? `Restore ${label}` : `Maximize ${label}`}
          className="btn hidden lg:inline-flex !p-0 w-7 h-6"
        >
          {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => desktop.close(spec.id)}
          aria-label={`Close ${label}`}
          className="btn !p-0 w-11 h-9 lg:w-7 lg:h-6"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {body}
      {status}
    </section>
  );
}
