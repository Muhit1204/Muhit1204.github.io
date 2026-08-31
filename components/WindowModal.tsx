'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { audio } from '@/lib/audio';

/*
 * A draggable console window for things that would otherwise open in a new
 * tab — the UAS summary deck, the AI systems PDF, project screenshots. The
 * external link is still offered inside, so nothing is trapped in the modal.
 *
 * Focus is moved in on open and returned on close, Escape dismisses, and Tab
 * is kept inside while it is up.
 */
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement;
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
        'a[href], button, iframe, [tabindex]:not([tabindex="-1"])',
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

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-bg/85"
          onClick={hide}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-5xl h-[85vh] flex flex-col border border-accent-dim bg-surface shadow-[0_0_40px_rgba(0,255,156,0.15)]"
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-line bg-surface-2 text-xs shrink-0">
              <span className="text-accent">●</span>
              <span className="text-muted truncate">{title}</span>
              <div className="ml-auto flex items-center gap-3">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors"
                >
                  open in tab
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={hide}
                  aria-label="Close window"
                  className="text-muted hover:text-danger transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-bg">
              {kind === 'pdf' ? (
                <iframe src={src} title={title} className="w-full h-full border-0" />
              ) : (
                <div className="w-full h-full overflow-auto p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={title} className="w-full h-auto border border-line" />
                </div>
              )}
            </div>

            <div className="px-3 py-1.5 border-t border-line bg-surface-2 text-[0.65rem] text-muted shrink-0">
              <span className="text-accent">esc</span> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
