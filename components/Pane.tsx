import type { ReactNode } from 'react';
import DesktopWindow from '@/components/desktop/DesktopWindow';
import ScrambleText from '@/components/ScrambleText';
import DesktopIcon from '@/components/desktop/DesktopIcon';
import { WINDOWS } from '@/components/desktop/windows';

/*
 * A section of the site, as a window. On the home route it is a managed
 * desktop window that opens from the taskbar or its icon; on the other routes
 * the same frame sits in the page flow. Either way the frame carries the
 * identity so the content inside can stay plain and readable: the command
 * that "produced" the contents, the heading, then the output.
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
  const icon = WINDOWS.find((spec) => spec.id === id)?.icon ?? (id === 'education' ? 'cap' : 'doc');
  return (
    <DesktopWindow
      id={id}
      title={path}
      footer={
        <>
          <span className="font-bold">muntasir@portfolio</span>
          <span className="truncate">{status ?? path}</span>
          <span className="ml-auto hidden sm:inline shrink-0">
            {index}/{total}
          </span>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2 border-b border-line pb-3">
          <p className="term-label">{command}</p>
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-body">
            <DesktopIcon name={icon} size={32} className="shrink-0" />
            <ScrambleText text={title} />
          </h2>
        </div>
        {children}
      </div>
    </DesktopWindow>
  );
}
