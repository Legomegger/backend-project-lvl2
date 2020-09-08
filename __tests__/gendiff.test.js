import {
  test, expect, beforeAll, describe,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/index.js';

let resultStylish;
let resultPlain;
let resultJson;

const extensions = ['yml', 'ini', 'json'];

const getFixturePath = (filename) => {
  const dirname = path.resolve();
  return path.join(dirname, '.', '__tests__', '__fixtures__', filename);
};

beforeAll(() => {
  resultStylish = fs.readFileSync(getFixturePath('stylish.txt'), 'utf-8').trim();
  resultPlain = fs.readFileSync(getFixturePath('plain.txt'), 'utf-8').trim();
  resultJson = fs.readFileSync(getFixturePath('json.txt'), 'utf-8').trim();
});

extensions.forEach((extension) => {
  const dirname = path.resolve();
  const before = path.join(dirname, `./__tests__/__fixtures__/before.${extension}`);
  const after = path.join(dirname, `./__tests__/__fixtures__/after.${extension}`);
  describe('test stylish', () => {
    test(`${extension} stylish`, () => {
      expect(gendiff(before, after, 'stylish')).toBe(resultStylish);
    });
  });
  describe('test plain', () => {
    test(`${extension} plain`, () => {
      expect(gendiff(before, after, 'plain')).toBe(resultPlain);
    });
  });
  describe('test json', () => {
    test(`${extension} json`, () => {
      expect(gendiff(before, after, 'json')).toBe(resultJson);
    });
  });
});
