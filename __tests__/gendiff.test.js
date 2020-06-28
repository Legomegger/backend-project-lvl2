import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

test('test', () => {
  const dirname = path.resolve();
  const before = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/before.json'), 'utf-8');
  const after = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/after.json'), 'utf-8');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8');
  expect(gendiff(before, after)).toBe(res);
});
