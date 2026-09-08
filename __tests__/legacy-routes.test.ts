import { describe, expect, it } from 'vitest';
import { LEGACY_ROUTES, legacyDestination } from '../lib/legacy-routes';

describe('legacy route compatibility', () => {
  it.each(Object.keys(LEGACY_ROUTES) as Array<keyof typeof LEGACY_ROUTES>)(
    '/%s points to its canonical homepage section',
    (route) => {
      expect(legacyDestination(route)).toBe('/#' + route);
    },
  );
});