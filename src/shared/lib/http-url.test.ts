import { describe, expect, it } from 'vitest';
import { isHttpUrl, normalizeHttpUrl } from './http-url';

describe('http url helpers', () => {
  it('adds https and keeps empty values', () => {
    expect(normalizeHttpUrl('')).toBe('');
    expect(normalizeHttpUrl('pmfk.example')).toBe('https://pmfk.example/');
    expect(normalizeHttpUrl('https://pmfk.example')).toBe('https://pmfk.example/');
  });

  it('rejects non-http schemes', () => {
    expect(isHttpUrl(normalizeHttpUrl('javascript:alert(1)'))).toBe(false);
    expect(isHttpUrl('ftp://files.example')).toBe(false);
    expect(isHttpUrl('')).toBe(true);
  });
});
