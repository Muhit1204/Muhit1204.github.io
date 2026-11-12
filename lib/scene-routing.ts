import { isWindowId } from '@/components/desktop/windows';

/** Old root anchors and fallback routes only accept known section IDs. */
export function desktopDestination(hash = ''): string {
  try {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    return isWindowId(id) ? `/desktop#${id}` : '/desktop';
  } catch {
    return '/desktop';
  }
}

export const SCENE_SIZE_QUERY = '(min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine)';
