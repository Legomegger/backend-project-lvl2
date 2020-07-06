import _ from 'lodash';
import path from 'path';
import { parseJson, parseYml } from './parsers.js';

const prettifyResultList = (list) => list.map((element, index) => (index === 0 ? element : ` ${element}`));

const getFileExtension = (filename) => path.extname(filename);
const isJson = (extension) => extension.split('.')[1] === 'json';
const isYml = (extension) => extension.split('.')[1] === 'yml' || extension.split('.')[1] === 'yaml';
const makeDiff = (objectA, objectB) => {
  const fileAKeys = Object.keys(objectA);
  const fileBKeys = Object.keys(objectB);

  const removedAcc = fileAKeys.reduce((acc, key) => (_.has(objectB, key) ? acc : [...acc, ` - ${key}: ${objectA[key]}\n`]), []);
  const addedAcc = fileBKeys.reduce((acc, key) => (_.has(objectA, key) ? acc : [...acc, ` + ${key}: ${objectB[key]}\n`]), []);
  const changedAcc = fileAKeys.reduce((acc, key) => {
    if (_.has(objectB, key) && objectA[key] !== objectB[key]) {
      return [...acc, ` - ${key}: ${objectA[key]}\n`, ` + ${key}: ${objectB[key]}\n`];
    }
    if (_.has(objectB, key) && objectA[key] === objectB[key]) {
      return [...acc, `   ${key}: ${objectA[key]}\n`];
    }
    return acc;
  }, []);

  const removedString = prettifyResultList(removedAcc);
  const addedString = prettifyResultList(addedAcc);
  const changedString = prettifyResultList(changedAcc);
  const resultString = `{\n ${[...changedString]} ${[...removedString]} ${[...addedString]}}\n`.split(', ').join(' ');
  return resultString;
};

export default (filepath1, filepath2) => {
  const fileTypeA = getFileExtension(filepath1);
  const fileTypeB = getFileExtension(filepath2);

  if (fileTypeA !== fileTypeB) return 'Error! Files are not the same type';

  if (isJson(fileTypeA)) {
    const [objectA, objectB] = parseJson(filepath1, filepath2);
    return makeDiff(objectA, objectB);
  } if (isYml(fileTypeA)) {
    const [objectA, objectB] = parseYml(filepath1, filepath2);
    return makeDiff(objectA, objectB);
  }
  return 'Error';
};
