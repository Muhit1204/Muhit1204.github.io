'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { audio } from '@/lib/audio';
import DesktopIcon from '@/components/desktop/DesktopIcon';

// pdfjs is heavy and only needed once a document window opens.
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });

/*
 * A draggable console window for things that would otherwise open in a new
 * tab — the summary deck, the AI systems PDF, project screenshots. PDFs are
 * rendered page by page by PdfViewer rather than handed to an <iframe>, so
 * the browser's own viewer chrome never appears inside the window.
 *
 * Rendered through a portal into <body>. That is not a style choice: an
 * ancestor with a transform or a will-change on transform becomes the
 * containing block for position:fixed, and the panes on this page animate on
 * both. Rendering in place would pin the window to its pane instead of the
 * viewport, which is exactly what it did before.
 */
/** True once hydrated, so the portal target exists. */
const subscribe = () => () => {};

export default function WindowModal({
  label,
  title,
  src,
  kind,
  className = '',
}: {
  label: string;
  title: string;
  src: string;
  kind: 'pdf' | 'image';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const drag = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [draggable, setDraggable] = useState(false);

  // The window fills the screen on a phone, where there is nowhere to drag it
  // to and the gesture would fight the page scroll.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setDraggable(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement;
    setOffset({ x: 0, y: 0 }); // Always reopen centred.
    setOpen(true);
    audio.open();
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    audio.close();
    opener.current?.focus();
  }, []);

  // Escape closes; Tab cycles within the window rather than escaping behind it.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, hide]);

  /* Dragging by the title bar. Pointer capture keeps the moves coming even
     when the cursor leaves the bar mid-drag. */
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if ((event.target as HTMLElement).closest('button, a')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    setOffset({
      x: state.originX + (event.clientX - state.startX),
      y: state.originY + (event.clientY - state.startY),
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  const modal = (
    <div className="fixed inset-0 z-[90] flex items-center justify-center md:p-4 bg-black/40" onClick={hide}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        style={draggable ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}
        className="window desk-window w-full h-full md:h-[85vh] md:max-w-5xl flex flex-col"
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`titlebar titlebar-active mb-[3px] shrink-0 ${draggable ? 'cursor-move touch-none' : ''}`}
        >
          <DesktopIcon name={kind === 'pdf' ? 'pdf' : 'doc'} size={20} className="shrink-0" />
          <span className="truncate">{title}</span>
          <span className="titlebar-grip" aria-hidden="true" />
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn !py-1 text-xs font-normal">
            open in tab
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={hide}
            aria-label="Close window"
            className="btn !p-0 w-11 h-9 md:w-7 md:h-6"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bevel-sunken flex-1 min-h-0 p-[2px] bg-[#808080]">
          {kind === 'pdf' ? (
            <PdfViewer src={src} title={title} />
          ) : (
            <div className="w-full h-full overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} className="w-full h-auto shadow-[4px_4px_0_rgba(0,0,0,0.4)]" />
            </div>
          )}
        </div>

        <div className="px-2 pt-1.5 pb-0.5 font-mono text-[0.65rem] text-black shrink-0">
          <span className="font-bold">esc</span> to close
          {draggable && ' · drag the title bar to move'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={show}
        className={`inline-flex items-center gap-1.5 text-xs text-accent hover:underline ${className}`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        {label}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
