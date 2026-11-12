import { describe, expect, it } from 'vitest';
import { desktopDestination } from '../lib/scene-routing';

describe('scene entry compatibility', () => {
  it.each(['about', 'projects', 'skills', 'terminal', 'contact'])(
    'preserves the old /#%s deep link', (id) => {
      expect(desktopDestination(`#${id}`)).toBe(`/desktop#${id}`);
    },
  );
  it('decodes known escaped section names', () => {
    expect(desktopDestination('#%73kills')).toBe('/desktop#skills');
  });
  it.each(['', '#unknown', '#%E0%A4%A', '#https://example.com', '#../education'])(
    'keeps fallback navigation internal for %s', (hash) => {
      expect(desktopDestination(hash)).toBe('/desktop');
    },
  );
});
