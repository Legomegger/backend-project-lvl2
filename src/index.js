import fs from 'fs';
import path from 'path';
import genDiff from './gendiff.js';
import format from './formatters/index.js';
import parse from './parsers/index.js';

const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

const getFileFormat = (filename) => path.extname(filename).split('.')[1];

const relativePath = (filepath) => !filepath.includes(process.cwd());

const normalizePath = (filepath) => {
  if (relativePath(filepath)) {
    return `${process.cwd()}/${filepath}`;
  }
  return filepath;
};

export default (filepath1, filepath2, formatName) => {
  const correctFilePath1 = normalizePath(filepath1);
  const correctFilePath2 = normalizePath(filepath2);

  const dataFormat1 = getFileFormat(correctFilePath1);
  const dataFormat2 = getFileFormat(correctFilePath2);

  const file1Content = getFileContent(correctFilePath1);
  const file2Content = getFileContent(correctFilePath2);

  const object1 = parse(dataFormat1, file1Content);
  const object2 = parse(dataFormat2, file2Content);

  const diff = genDiff(object1, object2);

  return format(diff, formatName);
};
