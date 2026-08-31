'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

/*
 * Renders a PDF page by page onto canvases instead of handing the file to an
 * <iframe>. The browser's built-in viewer brings its own grey toolbar,
 * thumbnail rail and vendor badge, none of which belong inside a console
 * window — this way every pixel of chrome is ours.
 *
 * pdfjs is imported dynamically so its ~400 KB never loads for anyone who
 * does not open a document.
 */

type PageView = { number: number; canvas: HTMLCanvasElement };

/** Multipliers on the fit-to-width base scale. */
const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2];
const FIT_INDEX = 2;

export default function PdfViewer({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageView[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(FIT_INDEX);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const renderToken = useRef(0);
  // Bumped when a document finishes parsing, to kick off the first render.
  const [loadedAt, setLoadedAt] = useState(0);

  const zoom = ZOOM_STEPS[zoomIndex];

  /* The document is fetched once per file; zoom only re-rasterises the pages
     that are already parsed, so changing zoom never re-downloads anything. */
  const docRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;
    docRef.current = null;
    setPages([]);
    setTotal(0);
    setStatus('loading');

    const load = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        // The worker ships from /public so the static export can serve it.
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const doc = await pdfjs.getDocument({ url: src }).promise;
        if (cancelled) {
          void doc.loadingTask.destroy();
          return;
        }
        docRef.current = doc;
        setTotal(doc.numPages);
        setLoadedAt(Date.now());
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    void load();
    return () => {
      cancelled = true;
      void docRef.current?.loadingTask.destroy();
      docRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const doc = docRef.current;
    if (!doc) return;

    let cancelled = false;
    const token = ++renderToken.current;

    const render = async () => {
      setStatus('loading');
      try {
        /* Fit the first page to the window, then treat zoom as a multiplier
           on that. Without this, 100% meant PDF points as CSS pixels, which
           overflowed the container and pushed every page off to the left. */
        const first = await doc.getPage(1);
        const natural = first.getViewport({ scale: 1 }).width;
        const container = containerRef.current;
        const padding = container && container.clientWidth < 640 ? 16 : 48;
        const available = (container?.clientWidth ?? 800) - padding;
        const fit = Math.max(available / natural, 0.2);

        const rendered: PageView[] = [];

        for (let number = 1; number <= doc.numPages; number += 1) {
          const page = await doc.getPage(number);
          if (cancelled || token !== renderToken.current) return;

          // Render at device resolution so text stays crisp when scaled.
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale: fit * zoom * ratio });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${Math.round(viewport.width / ratio)}px`;
          canvas.style.height = 'auto';
          canvas.className = 'block border border-line bg-white';

          const context = canvas.getContext('2d');
          if (!context) continue;
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          if (cancelled || token !== renderToken.current) return;

          rendered.push({ number, canvas });
          // Show pages as they finish rather than waiting for the whole file.
          setPages([...rendered]);
        }

        if (!cancelled && token === renderToken.current) setStatus('ready');
      } catch {
        if (!cancelled && token === renderToken.current) setStatus('error');
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [zoom, loadedAt]);

  // Track which page is under the read line so the counter means something.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || pages.length === 0) return;

    let queued = false;
    const measure = () => {
      queued = false;
      const middle = container.scrollTop + container.clientHeight / 2;
      const children = Array.from(container.querySelectorAll<HTMLElement>('[data-page]'));
      const hit = children.findIndex((el) => el.offsetTop + el.offsetHeight > middle);
      setCurrent(hit === -1 ? children.length : hit + 1);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [pages.length]);

  const goTo = useCallback((number: number) => {
    const container = containerRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-page="${number}"]`);
    if (container && target) container.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Our toolbar, not the browser's. */}
      <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-3 py-1 border-b border-line bg-surface text-[0.7rem] shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(Math.max(current - 1, 1))}
            disabled={current <= 1}
            aria-label="Previous page"
            className="p-2 md:p-1 text-muted hover:text-accent disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-muted tabular-nums">
            <span className="text-accent">{current}</span> / {total || '—'}
          </span>
          <button
            type="button"
            onClick={() => goTo(Math.min(current + 1, total))}
            disabled={current >= total}
            aria-label="Next page"
            className="p-2 md:p-1 text-muted hover:text-accent disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}
            disabled={zoomIndex === 0}
            aria-label="Zoom out"
            className="p-2 md:p-1 text-muted hover:text-accent disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-muted tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1))}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
            className="p-2 md:p-1 text-muted hover:text-accent disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-auto bg-bg p-2 sm:p-4">
        {status === 'loading' && pages.length === 0 && (
          <p className="text-xs text-muted">
            <span className="text-accent">$ </span>
            rendering {title} <span className="term-cursor" />
          </p>
        )}

        {status === 'error' && (
          <p className="text-xs text-danger">
            [FAIL] could not render this document — use “open in tab” instead.
          </p>
        )}

        <div className="flex flex-col items-center gap-4 min-w-fit">
          {pages.map((page) => (
            <div key={page.number} data-page={page.number} className="relative">
              <span className="absolute -top-2 left-0 text-[0.6rem] text-muted bg-bg px-1">
                {String(page.number).padStart(2, '0')}
              </span>
              <div
                // The canvas is produced by pdfjs, so it is attached rather
                // than rendered by React.
                ref={(node) => {
                  if (node && node.firstChild !== page.canvas) {
                    node.replaceChildren(page.canvas);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
