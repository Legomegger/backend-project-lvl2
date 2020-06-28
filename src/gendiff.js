import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const prettifyResultList = (list) => list.map((element, index) => (index === 0 ? element : ` ${element}`));

const relativePath = (filepath) => !filepath.includes(path.resolve());
const getFileName = (filepath) => filepath.split('/')[filepath.split('/').length - 1];

const normalizePath = (filepath) => {
  if (relativePath(filepath)) {
    const fileName = getFileName(filepath);
    return `${path.resolve()}/${fileName}`;
  }
  return filepath;
};

export default (fileA, fileB) => {
  const fileAJson = JSON.parse(fs.readFileSync(normalizePath(fileA), 'utf-8'));
  const fileBJson = JSON.parse(fs.readFileSync(normalizePath(fileB), 'utf-8'));
  const fileAKeys = Object.keys(fileAJson);
  const fileBKeys = Object.keys(fileBJson);

  const removedAcc = fileAKeys.reduce((acc, key) => (_.has(fileBJson, key) ? acc : [...acc, `- ${key}: ${fileAJson[key]}`]), []);
  const addedAcc = fileBKeys.reduce((acc, key) => (_.has(fileAJson, key) ? acc : [...acc, `+ ${key}: ${fileBJson[key]}`]), []);
  const changedAcc = fileAKeys.reduce((acc, key) => {
    if (_.has(fileBJson, key) && fileAJson[key] !== fileBJson[key]) {
      return [...acc, `+ ${key}: ${fileAJson[key]}`, `- ${key}: ${fileBJson[key]}`];
    }
    if (_.has(fileBJson, key) && fileAJson[key] === fileBJson[key]) {
      return [...acc, `${key}: ${fileAJson[key]}`];
    }
    return acc;
  }, []);

  const removedString = prettifyResultList(removedAcc);
  const addedString = prettifyResultList(addedAcc);
  const changedString = prettifyResultList(changedAcc);
  const resultString = `{ ${[...changedString]} ${[...removedString]} ${[...addedString]} }`.split(', ').join(' ');
  return resultString;
};
