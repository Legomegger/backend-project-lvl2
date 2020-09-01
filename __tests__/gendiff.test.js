import {
  test, expect, beforeAll, describe,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

let resultStylish;
let resultPlain;
let resultJson;

const formats = ['stylish', 'plain', 'json'];

const resultPicker = (format) => {
  const dict = {
    stylish: resultStylish,
    plain: resultPlain,
    json: resultJson,
  };
  return dict[format];
};

beforeAll(() => {
  const dirname = path.resolve();
  resultStylish = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/stylish.txt'), 'utf-8').trim();
  resultPlain = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/plain.txt'), 'utf-8').trim();
  resultJson = fs.readFileSync(path.join(dirname, './__tests__/__fixtures__/json.txt'), 'utf-8').trim();
});

describe('test json files', () => {
  test.each(formats)('testing %p format', (format) => {
    const dirname = path.resolve();
    const before = path.join(dirname, './__tests__/__fixtures__/before.json');
    const after = path.join(dirname, './__tests__/__fixtures__/after.json');
    expect(gendiff(before, after, format)).toBe(resultPicker(format));
  });
});

describe('test yml files', () => {
  test.each(formats)('testing %p format', (format) => {
    const dirname = path.resolve();
    const before = path.join(dirname, './__tests__/__fixtures__/before.yml');
    const after = path.join(dirname, './__tests__/__fixtures__/after.yml');
    expect(gendiff(before, after, format)).toBe(resultPicker(format));
  });
});
describe('test ini files', () => {
  test.each(formats)('testing %p format', (format) => {
    const dirname = path.resolve();
    const before = path.join(dirname, './__tests__/__fixtures__/before.ini');
    const after = path.join(dirname, './__tests__/__fixtures__/after.ini');
    expect(gendiff(before, after, format)).toBe(resultPicker(format));
  });
});
