import { test, expect } from '@jest/globals';
import gendiff from '../src/gendiff.js';

test('test', () => {
  const beforePath = './__tests__/__fixtures__/before.json';
  const afterPath = './__tests__/__fixtures__/after.json';
  const result = `{ host: hexlet.io, + timeout: 50, - timeout: 20, - proxy: 123.234.53.22, - follow: false, + verbose: true }`

  expect(gendiff(beforePath, afterPath)).toBe(result);
});
