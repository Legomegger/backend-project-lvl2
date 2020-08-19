import _ from 'lodash';
import path from 'path';
import { parseJson, parseYml, parseIni } from './parsers.js';

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

const printObject = (object, indentation = 2, spacer = ' ') => Object.entries(object).reduce((acc, [key, value]) => {
  if (_.isObject(value)) {
    return acc.concat(`${spacer.repeat(indentation + 2)}${key}: {\n${printObject(value, indentation + 4)}${spacer.repeat(indentation + 2)}}\n`);
  }
  return acc.concat(`${spacer.repeat(indentation + 2)}${key}: ${value}\n`);
}, '');

const stylish = (diff, ind) => {
  const indent = () => {
    const space = ' ';
    return space.repeat(ind);
  };
  return diff.reduce((acc, e) => {
    if (e.type === 'removed') {
      if (_.isObject(e.value)) {
        return acc.concat(`${indent()}- ${e.key}: {\n${printObject(e.value, ind + 4)}${indent()}  }\n`);
      }
      return acc.concat(`${indent()}- ${e.key}: ${e.value}\n`);
    }
    if (e.type === 'added') {
      if (_.isObject(e.value)) {
        return acc.concat(`${indent()}+ ${e.key}: {\n${printObject(e.value, ind + 4)}${indent()}  }\n`);
      }
      return acc.concat(`${indent()}+ ${e.key}: ${e.value}\n`);
    }
    if (e.type === 'unchanged') {
      if (_.isObject(e.value)) {
        return acc.concat(`${indent()}  ${e.key}: {\n ${printObject(e.value, ind + 4)}}\n`);
      }
      return acc.concat(`${indent()}  ${e.key}: ${e.value}\n`);
    }
    if (e.type === 'changed') {
      if (_.isObject(e.beforeValue) && _.isObject(e.afterValue)) {
        return acc.concat(`${indent()}- ${e.key}: {\n${printObject(e.beforeValue, ind + 4)}}\n${indent()}+ ${e.key}: {\n${printObject(e.afterValue, ind + 4)}}\n`);
      }

      if (!_.isObject(e.beforeValue) && !_.isObject(e.afterValue)) {
        return acc.concat(`${indent()}- ${e.key}: ${e.beforeValue}\n${indent()}+ ${e.key}: ${e.afterValue}\n`);
      }

      if (!_.isObject(e.beforeValue) && _.isObject(e.afterValue)) {
        return acc.concat(`${indent()}- ${e.key}: ${e.beforeValue}\n${indent()}+ ${e.key}: {\n${printObject(e.afterValue, ind + 4)}${indent()}  }\n`);
      }

      if (_.isObject(e.beforeValue) && !_.isObject(e.afterValue)) {
        return acc.concat(`${indent()}- ${e.key}: {\n${printObject(e.beforeValue, ind + 4)}${indent()}  }\n${indent()}+ ${e.key}: ${e.afterValue}\n`);
      }
    }
    if (e.type === 'nested') {
      return acc.concat(`${indent()}  ${e.key}: {\n${stylish(e.children[0], ind + 4)}${indent()}  }\n`);
    }
    return acc;
  }, '');
};

export default (filepath1, filepath2) => {
  const fileTypeA = getFileExtension(filepath1);
  const fileTypeB = getFileExtension(filepath2);

  if (fileTypeA !== fileTypeB) return 'Error! Files are not the same type';

  if (isJson(fileTypeA)) {
    const [objectA, objectB] = parseJson(filepath1, filepath2);
    return `{\n${stylish(makeDiff(objectA, objectB), 2)}}`;
  } if (isYml(fileTypeA)) {
    const [objectA, objectB] = parseYml(filepath1, filepath2);
    return `{\n${stylish(makeDiff(objectA, objectB), 2)}}`;
  } if (isIni(fileTypeA)) {
    const [objectA, objectB] = parseIni(filepath1, filepath2);
    return `{\n${stylish(makeDiff(objectA, objectB), 2)}}`;
  }
  return 'Error';
};
