import fs from 'fs';
import path from 'path';
import has from 'lodash/has';

const prettifyResultList = (list) => list.map((element, index) => (index === 0 ? element : ` ${element}`));

export default (fileA, fileB) => {
  const dirname = path.resolve();
  const fileAJson = JSON.parse(fs.readFileSync(path.join(dirname, fileA), 'utf-8'));
  const fileBJson = JSON.parse(fs.readFileSync(path.join(dirname, fileB), 'utf-8'));
  const fileAKeys = Object.keys(fileAJson);
  const fileBKeys = Object.keys(fileBJson);

  const removedAcc = fileAKeys.reduce((acc, key) => (has(fileBJson, key) ? acc : [...acc, `- ${key}: ${fileAJson[key]}`]), []);
  const addedAcc = fileBKeys.reduce((acc, key) => (has(fileAJson, key) ? acc : [...acc, `+ ${key}: ${fileBJson[key]}`]), []);
  const changedAcc = fileAKeys.reduce((acc, key) => {
    if (has(fileBJson, key) && fileAJson[key] !== fileBJson[key]) {
      return [...acc, `+ ${key}: ${fileAJson[key]}`, `- ${key}: ${fileBJson[key]}`];
    }
    if (has(fileBJson, key) && fileAJson[key] === fileBJson[key]) {
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
