import fs from 'fs';
import path from 'path';
import genDiff from './src/gendiff.js';
import format from './src/formatters/index.js';
import { parseJson, parseYml, parseIni } from './src/parsers.js';

const getFileContents = (filepath) => fs.readFileSync(filepath, 'utf-8');

const getFileExtension = (filename) => path.extname(filename);
const isIni = (extension) => extension.split('.')[1] === 'ini';
const isJson = (extension) => extension.split('.')[1] === 'json';
const isYml = (extension) => extension.split('.')[1] === 'yml' || extension.split('.')[1] === 'yaml';

const getParser = (fileType) => {
  if (isJson(fileType)) {
    return (data) => parseJson(data);
  }
  if (isYml(fileType)) {
    return (data) => parseYml(data);
  }
  if (isIni(fileType)) {
    return (data) => parseIni(data);
  }
  return 'Error no such parser for filetype';
};

export default (filepath1, filepath2, type) => {
  const fileTypeA = getFileExtension(filepath1);
  const fileTypeB = getFileExtension(filepath2);

  if (fileTypeA !== fileTypeB) return 'Error! Files are not the same type';

  const fileAContent = getFileContents(filepath1);
  const fileBContent = getFileContents(filepath2);

  const parse = getParser(fileTypeA);

  const [objectA, objectB] = [parse(fileAContent), parse(fileBContent)];

  const diff = genDiff(objectA, objectB);

  return format(diff, type);
};
