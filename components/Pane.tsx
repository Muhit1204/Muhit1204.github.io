import type { ReactNode } from 'react';
import Reveal from '@/components/Reveal';
import ScrambleText from '@/components/ScrambleText';

/*
 * Every section is a pane in a terminal multiplexer: an index and path in the
 * title bar, the command that "produced" the contents, then the output, over
 * a status strip. The frame carries the identity so the content inside can
 * stay plain and readable.
 */
export default function Pane({
  id,
  index,
  total,
  path,
  command,
  title,
  status,
  children,
}: {
  id: string;
  index: number;
  total: number;
  path: string;
  command: string;
  title: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="rounded-none border border-line bg-surface/40 overflow-hidden">
        {/* Pane title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-surface-2 font-mono text-xs">
          <span className="text-accent shrink-0">[{index}]</span>
          <span className="text-muted truncate">{path}</span>
          <span className="ml-auto text-muted hidden sm:inline shrink-0">
            {index}:{id}
            <span className="text-accent">*</span>
          </span>
        </div>

        <div className="p-4 md:p-7 space-y-6">
          <div className="space-y-2 border-b border-line pb-3">
            <p className="term-label">{command}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-body">
              <ScrambleText text={title} />
            </h2>
          </div>
          {children}
        </div>

        {/* Status strip */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-line bg-surface-2 font-mono text-[0.65rem] text-muted">
          <span className="text-accent">muntasir@portfolio</span>
          <span className="truncate">{status ?? path}</span>
          <span className="ml-auto hidden sm:inline shrink-0">
            {index}/{total}
          </span>
        </div>
      </section>
    </Reveal>
  );
}
