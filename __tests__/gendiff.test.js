import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

test('Testing plain jsons - format Stylish', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.json');
  const after = path.join(dirname, './__tests__/__fixtures__/after.json');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after, 'stylish')).toBe(res);
});

test('Testing plain ymls - format Stylish', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.yml');
  const after = path.join(dirname, './__tests__/__fixtures__/after.yml');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after, 'stylish')).toBe(res);
});

test('Testing plain inis - format Stylish', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.ini');
  const after = path.join(dirname, './__tests__/__fixtures__/after.ini');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after), 'stylish').toBe(res);
});
test('Testing plain jsons - format Plain', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.json');
  const after = path.join(dirname, './__tests__/__fixtures__/after.json');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after, 'plain')).toBe(res);
});

test('Testing plain ymls - format plain', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.yml');
  const after = path.join(dirname, './__tests__/__fixtures__/after.yml');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after, 'plain')).toBe(res);
});

test('Testing plain inis - format plain', () => {
  const dirname = path.resolve();
  const before = path.join(dirname, './__tests__/__fixtures__/before.ini');
  const after = path.join(dirname, './__tests__/__fixtures__/after.ini');
  const res = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/result.txt'), 'utf-8').trim();
  expect(gendiff(before, after), 'plain').toBe(res);
});
