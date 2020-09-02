import fs from 'fs';
import path from 'path';
import genDiff from './gendiff.js';
import format from './formatters/index.js';
import parse from './parsers/index.js';

const getFileContents = (filepath) => fs.readFileSync(filepath, 'utf-8');

const getFileExtension = (filename) => path.extname(filename);

const relativePath = (filepath) => !filepath.includes(path.resolve());

const normalizePath = (filepath) => {
  if (relativePath(filepath)) {
    return `${path.resolve()}/${filepath}`;
  }
  return filepath;
};

export default (filepath1, filepath2, formatName) => {
  const correctFilePath1 = normalizePath(filepath1);
  const correctFilePath2 = normalizePath(filepath2);

  const fileType1 = getFileExtension(correctFilePath1);
  const fileType2 = getFileExtension(correctFilePath2);

  const file1Content = getFileContents(correctFilePath1);
  const file2Content = getFileContents(correctFilePath2);

  const object1 = parse(fileType1, file1Content);
  const object2 = parse(fileType2, file2Content);

  const diff = genDiff(object1, object2);

  return format(diff, formatName);
};
