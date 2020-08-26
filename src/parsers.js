import fs from 'fs';
import YAML from 'yaml';
import ini from 'ini';
import _ from 'lodash';

const getFileContents = (filepath1, filepath2) => {
  const fileA = fs.readFileSync(filepath1, 'utf-8');
  const fileB = fs.readFileSync(filepath2, 'utf-8');
  return [fileA, fileB];
};
const correctValue = (object) => {
  const printValue = (value) => {
    if (parseInt(value, 10)) {
      return parseInt(value, 10);
    }
    return value;
  };
  const entries = Object.entries(object);
  return entries.reduce((acc, [key, value]) => {
    if (!_.isObject(value)) {
      return { ...acc, [key]: printValue(value) };
    }
    if (_.isObject(value)) {
      return { ...acc, [key]: correctValue(value) };
    }
    return acc;
  }, {});
};
export const parseJson = (filepath1, filepath2) => {
  const [objectA, objectB] = getFileContents(filepath1, filepath2);
  return [JSON.parse(objectA), JSON.parse(objectB)];
};
export const parseYml = (filepath1, filepath2) => {
  const [objectA, objectB] = getFileContents(filepath1, filepath2);
  return [YAML.parse(objectA), YAML.parse(objectB)];
};
export const parseIni = (filepath1, filepath2) => {
  const [objectA, objectB] = getFileContents(filepath1, filepath2);
  return [correctValue(ini.parse(objectA)), correctValue(ini.parse(objectB))];
};
