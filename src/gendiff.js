import fs from 'fs';
import path from 'path';
import has from 'lodash/has';

export default (fileA, fileB) => {
  const dirname = path.resolve();
  const fileAJson = JSON.parse(fs.readFileSync(path.join(dirname, fileA), 'utf-8'));
  const fileBJson = JSON.parse(fs.readFileSync(path.join(dirname, fileB), 'utf-8'));
  const fileAKeys = Object.keys(fileAJson);
  const fileBKeys = Object.keys(fileBJson);
  const removedAcc = fileAKeys.reduce((acc, key) => {
    return has(fileBJson, key) ? acc : [...acc, `- ${key}: ${fileAJson[key]}`];
  }, []);
  console.log(removedAcc);
  const addedAcc = fileBKeys.reduce((acc, key) => {
    return has(fileAJson, key) ? acc : [...acc, `+ ${key}: ${fileBJson[key]}`];
  }, []);
  console.log(addedAcc);
  const changedAcc = fileAKeys.reduce((acc, key) => {
    if (has(fileBJson, key) && fileAJson[key] !== fileBJson[key]) {
      return [...acc, ` + ${key}: ${fileAJson[key]}`, ` - ${key}: ${fileBJson[key]}`]
    } else if (has(fileBJson, key) && fileAJson[key] === fileBJson[key]) {
      return [...acc, `${key}: ${fileAJson[key]}`];
    }
    return acc;
  }, []);
  console.log(changedAcc)
  const resultString = `{ ${[...changedAcc]}, ${[...removedAcc]}, ${[...addedAcc]} }`;
  console.log(JSON.stringify(resultString))
  return resultString;
};
