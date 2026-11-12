'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { audio } from '@/lib/audio';
import { INITIAL_WINDOWS, OPEN_EVENT, SIDE_WINDOWS_QUERY, isWindowId, type WindowId } from '@/components/desktop/windows';

/*
 * Which windows are open and how they stack. It lives inside DesktopShell
 * so each HTML route's taskbar shares its window state.
 * Cross-route links carry a hash to open the selected window after navigation.
 *
 * `order` is back to front: the last id is the focused window.
 */
type DesktopState = {
  order: WindowId[];
  top: WindowId | null;
  isOpen: (id: WindowId) => boolean;
  open: (id: WindowId) => void;
  close: (id: WindowId) => void;
};

const DesktopContext = createContext<DesktopState | null>(null);

/** True only underneath <Desktop>; panes elsewhere render as static windows. */
export const InDesktopContext = createContext(false);

export function useDesktop() {
  return useContext(DesktopContext);
}

export default function DesktopProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<WindowId[]>(INITIAL_WINDOWS);

  const open = useCallback((id: WindowId) => {
    setOrder((current) => {
      if (current[current.length - 1] === id) return current;
      if (!current.includes(id)) audio.open();
      return [...current.filter((entry) => entry !== id), id];
    });
  }, []);

  const close = useCallback((id: WindowId) => {
    audio.close();
    setOrder((current) => current.filter((entry) => entry !== id));
  }, []);

  /*
   * After hydration: drop the side windows where they would cover the reading
   * window, then honour a #section in the URL so links from search results,
   * the 404 page and old bookmarks land on the right window.
   */
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (isWindowId(id)) open(id);
    };
    const fromEvent = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (isWindowId(id)) open(id);
    };

    // Any in-page link to a window id opens that window: icons, taskbar,
    // buttons inside other windows. Handled here once rather than on each
    // link, and it works on a repeat click, where `hashchange` stays silent.
    const fromClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor || !document.querySelector('.desk-root')) return;
      const id = decodeURIComponent((anchor.getAttribute('href') ?? '').slice(1));
      if (!isWindowId(id)) return;
      event.preventDefault();
      open(id);
      window.history.replaceState(null, '', `#${id}`);
    };

    if (!window.matchMedia(SIDE_WINDOWS_QUERY).matches) {
      setOrder((current) => current.filter((id) => id !== 'globe' && id !== 'terminal'));
    }
    fromHash();

    window.addEventListener('hashchange', fromHash);
    window.addEventListener(OPEN_EVENT, fromEvent);
    document.addEventListener('click', fromClick);
    return () => {
      document.removeEventListener('click', fromClick);
      window.removeEventListener('hashchange', fromHash);
      window.removeEventListener(OPEN_EVENT, fromEvent);
    };
  }, [open]);

  const value = useMemo<DesktopState>(
    () => ({
      order,
      top: order[order.length - 1] ?? null,
      isOpen: (id) => order.includes(id),
      open,
      close,
    }),
    [order, open, close],
  );

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}
