/*
 * Every window on the desktop, as plain data: what its title bar and icon
 * say, where it opens on a wide screen, and whether the taskbar links to it.
 * The desktop shell, the taskbar and the terminal all read from this one
 * list, so a new section is one entry here plus its content in app/desktop/page.tsx.
 *
 * `frame` only applies from the `lg` breakpoint up. Below it every window
 * fills the screen, because there is nowhere useful to drag one on a phone.
 */

export type WindowId =
  | 'about'
  | 'experience'
  | 'publications'
  | 'projects'
  | 'skills'
  | 'log'
  | 'hobbies'
  | 'contact'
  | 'terminal'
  | 'globe';

export type IconName = 'doc' | 'folder' | 'book' | 'chip' | 'news' | 'tent' | 'mail' | 'terminal' | 'globe' | 'cap' | 'pdf';

export type DesktopWindowSpec = {
  id: WindowId;
  /** File-style name shown in the title bar and under the desktop icon. */
  file: string;
  /** Taskbar label. Windows without one are reached from their icon only. */
  nav?: string;
  icon: IconName;
  frame: string;
  /** Steps down and right from the frame, so stacked windows stay visible. */
  cascade?: number;
};

const CONTENT_FRAME =
  'lg:left-[7.75rem] lg:top-3 lg:w-[min(61rem,calc(100%-8.5rem))] lg:h-[calc(100%-9.5rem)]';

export const WINDOWS: DesktopWindowSpec[] = [
  {
    id: 'about',
    file: 'about.md',
    nav: 'about',
    icon: 'doc',
    frame:
      'lg:left-[7.75rem] lg:top-3 lg:h-[calc(100%-1.5rem)] lg:w-[calc(100%-8.5rem)] xl:w-[calc(100%-39rem)]',
  },
  { id: 'experience', file: 'experience.log', nav: 'experience', icon: 'folder', frame: CONTENT_FRAME, cascade: 1 },
  { id: 'publications', file: 'publications.bib', nav: 'publications', icon: 'book', frame: CONTENT_FRAME, cascade: 2 },
  { id: 'projects', file: 'projects/', nav: 'projects', icon: 'folder', frame: CONTENT_FRAME, cascade: 3 },
  { id: 'skills', file: 'skills.json', nav: 'skills', icon: 'chip', frame: CONTENT_FRAME, cascade: 4 },
  { id: 'log', file: 'changelog', nav: 'news', icon: 'news', frame: CONTENT_FRAME, cascade: 5 },
  {
    id: 'hobbies',
    file: '.offline',
    icon: 'tent',
    frame: 'lg:left-[26%] lg:top-[16%] lg:w-[38rem] lg:max-w-[calc(100%-2rem)] lg:max-h-[76%]',
  },
  {
    id: 'contact',
    file: 'contact.sh',
    nav: 'contact',
    icon: 'mail',
    frame: 'lg:left-[24%] lg:top-[10%] lg:w-[42rem] lg:max-w-[calc(100%-2rem)] lg:max-h-[84%]',
  },
  {
    id: 'globe',
    file: 'leo-globe.view',
    icon: 'globe',
    frame: 'lg:right-3 lg:top-3 lg:w-[29.75rem] lg:h-[calc(52%-0.75rem)]',
  },
  {
    id: 'terminal',
    file: 'terminal',
    icon: 'terminal',
    frame: 'lg:right-3 lg:bottom-3 lg:w-[29.75rem] lg:h-[calc(48%-1.5rem)]',
  },
];

export const WINDOW_IDS = WINDOWS.map((spec) => spec.id);

export function isWindowId(value: string): value is WindowId {
  return (WINDOW_IDS as string[]).includes(value);
}

export function windowSpec(id: WindowId): DesktopWindowSpec {
  return WINDOWS.find((spec) => spec.id === id) as DesktopWindowSpec;
}

/** Open at first paint on a wide screen, back to front. */
export const INITIAL_WINDOWS: WindowId[] = ['globe', 'terminal', 'about'];

/** Below this width the side windows would sit on top of the reading window. */
export const SIDE_WINDOWS_QUERY = '(min-width: 1280px)';

/** Fired by anything outside the React tree that wants a window opened. */
export const OPEN_EVENT = 'desktop:open';

export function requestWindow(id: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
}
