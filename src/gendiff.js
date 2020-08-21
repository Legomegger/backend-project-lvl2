import _ from 'lodash';
import path from 'path';
import { parseJson, parseYml, parseIni } from './parsers.js';
import format from './formatters/index.js';

const getFileExtension = (filename) => path.extname(filename);
const isIni = (extension) => extension.split('.')[1] === 'ini';
const isJson = (extension) => extension.split('.')[1] === 'json';
const isYml = (extension) => extension.split('.')[1] === 'yml' || extension.split('.')[1] === 'yaml';

const difference = (a, b) => a.filter((e) => !b.includes(e));
const intersect = (a, b) => a.filter((e) => b.includes(e));

const makeDiff = (objectA, objectB) => {
  const fileAEntries = Object.entries(objectA);
  const fileBEntries = Object.entries(objectB);

  const fileAKeys = fileAEntries.map(([key]) => key);
  const fileBKeys = fileBEntries.map(([key]) => key);

  const removed = difference(fileAKeys, fileBKeys).reduce((acc, e) => [...acc, { type: 'removed', key: e, value: objectA[e] }], []);

  const added = difference(fileBKeys, fileAKeys).reduce((acc, e) => [...acc, { type: 'added', key: e, value: objectB[e] }], []);

  const unchanged = intersect(fileAKeys, fileBKeys).reduce((acc, e) => {
    if (objectA[e] === objectB[e]) {
      return [...acc, { type: 'unchanged', key: e, value: objectA[e] }];
    }
    return acc;
  }, []);

  const changed = intersect(fileAKeys, fileBKeys).reduce((acc, e) => {
    if (!_.isObject(objectA[e]) || !_.isObject(objectB[e])) {
      if (objectA[e] !== objectB[e]) {
        return [...acc, {
          type: 'changed', key: e, beforeValue: objectA[e], afterValue: objectB[e],
        }];
      }
    }
    return acc;
  }, []);

  const nested = intersect(fileAKeys, fileBKeys).reduce((acc, e) => {
    if (_.isObject(objectA[e]) && _.isObject(objectB[e])) {
      return [...acc, { type: 'nested', key: e, children: [makeDiff(objectA[e], objectB[e])] }];
    }
    return acc;
  }, []);

  return [...removed, ...added, ...unchanged, ...changed, ...nested];
};

export default (filepath1, filepath2, type) => {
  const fileTypeA = getFileExtension(filepath1);
  const fileTypeB = getFileExtension(filepath2);

  if (fileTypeA !== fileTypeB) return 'Error! Files are not the same type';

  if (isJson(fileTypeA)) {
    const [objectA, objectB] = parseJson(filepath1, filepath2);
    const diff = makeDiff(objectA, objectB);
    return format(diff, type);
  } if (isYml(fileTypeA)) {
    const [objectA, objectB] = parseYml(filepath1, filepath2);
    const diff = makeDiff(objectA, objectB);
    return format(diff, type);
  } if (isIni(fileTypeA)) {
    const [objectA, objectB] = parseIni(filepath1, filepath2);
    const diff = makeDiff(objectA, objectB);
    return format(diff, type);
  }
  return 'Error';
};
