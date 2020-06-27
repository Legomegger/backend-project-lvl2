import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/gendiff.js';

test('test', () => {
  const beforePath = './__tests__/__fixtures__/before.json';
  const afterPath = './__tests__/__fixtures__/after.json';
  const dirname = path.resolve();
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8');
  expect(gendiff(beforePath, afterPath)).toBe(res);
});
