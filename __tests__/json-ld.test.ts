import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from '../lib/json-ld';

describe('serializeJsonLd', () => {
  it('escapes characters that could break out of a script element', () => {
    const attack = '</script><script>alert(1)</script>&';
    const serialized = serializeJsonLd({ attack });

    expect(serialized).not.toContain('<');
    expect(serialized).not.toContain('>');
    expect(serialized).not.toContain('&');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(JSON.parse(serialized)).toEqual({ attack });
  });
});