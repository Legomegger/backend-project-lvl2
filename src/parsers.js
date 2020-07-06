import fs from 'fs';
import YAML from 'yaml';

const getFileContents = (filepath1, filepath2) => {
  const fileA = fs.readFileSync(filepath1, 'utf-8');
  const fileB = fs.readFileSync(filepath2, 'utf-8');
  return [fileA, fileB];
};
export const parseJson = (filepath1, filepath2) => {
  const [objectA, objectB] = getFileContents(filepath1, filepath2);
  return [JSON.parse(objectA), JSON.parse(objectB)];
};
export const parseYml = (filepath1, filepath2) => {
  const [objectA, objectB] = getFileContents(filepath1, filepath2);
  return [YAML.parse(objectA), YAML.parse(objectB)];
};
