'use client';

import { Briefcase } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';
import TracedList from '@/components/TracedList';
import type { Bullet, Experience } from '@/lib/work';

/*
 * Experience cards. The rail, the node markers and the scroll activation all
 * come from TracedList; what is specific here is the role card itself —
 * a decrypting title, the [ACTIVE]/[ARCHIVED] state, and collapsed detail.
 */

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <ul className="space-y-3 text-muted">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-accent mt-1 text-xs shrink-0">›</span>
          <span className="leading-relaxed">
            {typeof item === 'string' ? (
              item
            ) : (
              <>
                <strong className="text-body font-semibold">{item.lead}</strong> {item.text}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <TracedList footer={`route traced · ${experiences.length} nodes`}>
      {experiences.map((exp) => {
        const isCurrent = exp.date.includes('Present');

        return (
          <article key={exp.title + exp.date} className="interactive-card rounded-none p-5 md:p-7 space-y-4">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
              <h3 className="text-xl font-bold text-body">
                <ScrambleText text={exp.title} />
              </h3>
              <span className="text-xs uppercase tracking-wider shrink-0">
                <span className={isCurrent ? 'text-accent' : 'text-muted'}>
                  [{isCurrent ? 'ACTIVE' : 'ARCHIVED'}]
                </span>{' '}
                <span className="text-muted">{exp.date}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-2 text-body">
                <Briefcase className="w-4 h-4 text-muted" />
                {exp.link ? (
                  <a href={exp.link} target="_blank" rel="noopener noreferrer">
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </span>
              <span className="hidden sm:inline text-line">•</span>
              <span className="text-xs text-muted">{exp.location}</span>
            </div>

            <BulletList items={exp.description.slice(0, 1)} />

            {exp.description.length > 1 && (
              <details className="border-t border-line pt-3">
                <summary className="text-xs text-muted hover:text-accent transition-colors select-none">
                  {exp.description.length - 1} more
                </summary>
                <div className="pt-4">
                  <BulletList items={exp.description.slice(1)} />
                </div>
              </details>
            )}
          </article>
        );
      })}
    </TracedList>
  );
}
