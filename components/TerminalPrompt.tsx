'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { audio } from '@/lib/audio';

/*
 * A working prompt in the hero. Not decoration — it parses commands, prints
 * output, and navigates the page. Everything it can reach is also reachable
 * by scrolling and by the navbar, so nothing here is the only route to
 * anything; it is a faster path for people who would rather type.
 */

type Entry = { prompt?: string; lines: Output[] };
type Output = { text: string; tone?: 'muted' | 'accent' | 'warn' };

/** Sections the prompt can jump to, and what `ls` reports. */
const SECTIONS: { id: string; blurb: string }[] = [
  { id: 'about', blurb: 'who I am and what I work on' },
  { id: 'experience', blurb: 'roles, 2021 to now' },
  { id: 'publications', blurb: '2 IEEE papers, 1 dataset' },
  { id: 'projects', blurb: '7 builds, source where public' },
  { id: 'skills', blurb: 'languages, ML, networking, security' },
  { id: 'log', blurb: 'news and awards, newest first' },
  { id: 'hobbies', blurb: 'away from the screen' },
  { id: 'contact', blurb: 'email, calendar, social' },
];

const LINKS: Record<string, { label: string; href: string }> = {
  github: { label: 'GitHub', href: 'https://github.com/Muhit1204' },
  linkedin: { label: 'LinkedIn', href: 'https://linkedin.com/in/mdmuntasirhossain98' },
  scholar: {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?view_op=list_works&hl=en&user=guXY-gQAAAAJ',
  },
  resume: { label: 'Résumé (PDF)', href: '/resume.pdf' },
  education: { label: 'Education page', href: '/education' },
  calendar: { label: 'Book a call', href: 'https://calendar.app.google/7bicmniscwJYaoA36' },
};

const HELP: Output[] = [
  { text: 'Available commands', tone: 'accent' },
  { text: '  help                 this list' },
  { text: '  ls                   list sections' },
  { text: '  cd <section>         scroll to a section' },
  { text: '  whoami               short bio' },
  { text: '  open <link>          github · linkedin · scholar · resume · education · calendar' },
  { text: '  contact              email and calendar' },
  { text: '  clear                clear the screen' },
  { text: 'Tab completes. Up and Down walk history.', tone: 'muted' },
];

const BANNER: Entry = {
  lines: [
    { text: 'Type `help` for commands, or just scroll.', tone: 'muted' },
  ],
};

const WHOAMI: Output[] = [
  { text: 'Md Muntasir Hossain', tone: 'accent' },
  { text: 'Doctor of Engineering student, Electrical & Computer Engineering' },
  { text: 'Graduate Research Assistant, Lamar University' },
  { text: 'Center of Data, AI and Cybersecurity' },
  { text: 'Research: AI-enabled cybersecurity for LEO satellite communications', tone: 'muted' },
];

export default function TerminalPrompt() {
  const [history, setHistory] = useState<Entry[]>([BANNER]);
  const [input, setInput] = useState('');
  const [past, setPast] = useState<string[]>([]);
  const [pastIndex, setPastIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const print = useCallback((prompt: string, lines: Output[]) => {
    setHistory((h) => [...h, { prompt, lines }]);
  }, []);

  const goTo = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }, []);

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (line === '') {
        setHistory((h) => [...h, { prompt: '', lines: [] }]);
        return;
      }

      setPast((p) => [...p, line]);
      setPastIndex(-1);

      const [command, ...rest] = line.split(/\s+/);
      const argument = rest.join(' ').toLowerCase();

      switch (command.toLowerCase()) {
        case 'help':
        case '?':
          print(line, HELP);
          break;

        case 'ls':
        case 'dir':
          print(
            line,
            SECTIONS.map((section) => ({
              text: `  ${section.id.padEnd(14)}${section.blurb}`,
            })),
          );
          break;

        case 'whoami':
          print(line, WHOAMI);
          break;

        case 'cd':
        case 'goto': {
          if (!argument) {
            print(line, [{ text: 'usage: cd <section> — try `ls`', tone: 'warn' }]);
            break;
          }
          const match = SECTIONS.find((section) => section.id === argument);
          if (match && goTo(match.id)) {
            print(line, [{ text: `→ ${match.id}`, tone: 'accent' }]);
          } else {
            print(line, [{ text: `cd: no such section: ${argument}`, tone: 'warn' }]);
          }
          break;
        }

        case 'open': {
          const link = LINKS[argument];
          if (!link) {
            print(line, [
              { text: `open: unknown target: ${argument || '(none)'}`, tone: 'warn' },
              { text: `available: ${Object.keys(LINKS).join(' · ')}`, tone: 'muted' },
            ]);
            break;
          }
          window.open(link.href, link.href.startsWith('http') ? '_blank' : '_self', 'noopener,noreferrer');
          print(line, [{ text: `opening ${link.label} …`, tone: 'accent' }]);
          break;
        }

        case 'contact':
          goTo('contact');
          print(line, [
            { text: 'mhossain54@lamar.edu', tone: 'accent' },
            { text: 'muntasir.hossain007@gmail.com', tone: 'accent' },
            { text: 'run `open calendar` to book a time', tone: 'muted' },
          ]);
          break;

        case 'clear':
        case 'cls':
          setHistory([]);
          break;

        case 'sudo':
          print(line, [{ text: 'muntasir is not in the sudoers file. This incident will be reported.', tone: 'warn' }]);
          break;

        case 'exit':
        case 'logout':
          print(line, [{ text: 'There is no exit. Keep scrolling.', tone: 'muted' }]);
          break;

        default:
          print(line, [{ text: `${command}: command not found — try \`help\``, tone: 'warn' }]);
      }
    },
    [goTo, print],
  );

  const complete = useCallback(() => {
    const [command, ...rest] = input.split(/\s+/);
    // Complete the argument once a command that takes one is typed.
    if (rest.length > 0 && (command === 'cd' || command === 'goto')) {
      const partial = rest.join(' ');
      const hit = SECTIONS.find((section) => section.id.startsWith(partial));
      if (hit) setInput(`${command} ${hit.id}`);
      return;
    }
    if (rest.length > 0 && command === 'open') {
      const hit = Object.keys(LINKS).find((key) => key.startsWith(rest.join(' ')));
      if (hit) setInput(`open ${hit}`);
      return;
    }
    const commands = ['help', 'ls', 'cd', 'whoami', 'open', 'contact', 'clear'];
    const hit = commands.find((c) => c.startsWith(command));
    if (hit) setInput(rest.length > 0 ? `${hit} ${rest.join(' ')}` : hit);
  }, [input]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Printable keys and the edit keys click; modifiers stay silent.
    if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
      audio.key();
    }

    if (event.key === 'Enter') {
      audio.click();
      run(input);
      setInput('');
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      complete();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (past.length === 0) return;
      const next = pastIndex === -1 ? past.length - 1 : Math.max(0, pastIndex - 1);
      setPastIndex(next);
      setInput(past[next]);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (pastIndex === -1) return;
      const next = pastIndex + 1;
      if (next >= past.length) {
        setPastIndex(-1);
        setInput('');
      } else {
        setPastIndex(next);
        setInput(past[next]);
      }
    }
  };

  return (
    <div
      className="rounded-none border border-line bg-surface overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-line bg-surface-2 text-xs">
        <span className="text-accent">●</span>
        <span className="text-muted">muntasir@portfolio: ~</span>
        <span className="ml-auto text-muted hidden sm:inline">bash</span>
      </div>

      <div ref={logRef} className="p-3 sm:p-4 h-48 sm:h-64 md:h-80 overflow-y-auto text-xs md:text-sm leading-relaxed space-y-1">
        {history.map((entry, i) => (
          <div key={i} className="space-y-0.5">
            {entry.prompt !== undefined && (
              <p>
                <span className="text-accent">muntasir@portfolio</span>
                <span className="text-muted">:~$ </span>
                <span className="text-body">{entry.prompt}</span>
              </p>
            )}
            {entry.lines.map((output, j) => (
              <p
                key={j}
                style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                className={
                  output.tone === 'accent'
                    ? 'text-accent'
                    : output.tone === 'warn'
                      ? 'text-warn'
                      : output.tone === 'muted'
                        ? 'text-muted'
                        : 'text-body'
                }
              >
                {output.text}
              </p>
            ))}
          </div>
        ))}

        {/* The live prompt */}
        <label className="flex items-baseline gap-0 cursor-text">
          <span className="text-accent shrink-0">muntasir@portfolio</span>
          <span className="text-muted shrink-0">:~$&nbsp;</span>
          <span className="sr-only">Terminal command input</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command input. Type help for a list of commands."
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-body caret-accent"
          />
        </label>
      </div>

      {/* Touch keyboards have no Tab and no arrow history, so the common
          commands are one tap away instead. */}
      <div className="md:hidden flex flex-wrap gap-2 px-3 pb-3 border-t border-line pt-3">
        {['help', 'ls', 'whoami', 'contact', 'clear'].map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              audio.key();
              run(command);
            }}
            className="px-2.5 py-1.5 border border-line text-[0.7rem] text-muted active:border-accent-dim active:text-accent"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
