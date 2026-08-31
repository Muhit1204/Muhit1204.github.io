'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { audio } from '@/lib/audio';

/*
 * Copies a BibTeX entry. The entry is also rendered in a <pre> below so it
 * can be selected by hand — the clipboard API needs a secure context and
 * permission, and a citation that cannot be retrieved is worse than one that
 * takes two extra keystrokes.
 */
export default function CiteButton({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    audio.click();
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setFailed(false);
    } catch {
      // Insecure context, denied permission, or no clipboard API.
      setFailed(true);
      setCopied(false);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2400);
  }, [bibtex]);

  return (
    <details className="border-t border-line pt-3">
      <summary className="text-xs text-muted hover:text-accent transition-colors select-none">
        BibTeX
      </summary>
      <div className="pt-3 space-y-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-line text-[0.7rem] text-muted hover:border-accent-dim hover:text-accent transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'copied' : failed ? 'select below to copy' : 'copy entry'}
        </button>
        <pre className="overflow-x-auto border border-line bg-bg p-3 text-[0.68rem] leading-relaxed text-muted">
          {bibtex}
        </pre>
      </div>
    </details>
  );
}
