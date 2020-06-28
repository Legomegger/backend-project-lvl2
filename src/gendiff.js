import _ from 'lodash';

const prettifyResultList = (list) => list.map((element, index) => (index === 0 ? element : ` ${element}`));

export default (fileA, fileB) => {
  const fileAJson = JSON.parse(fileA);
  const fileBJson = JSON.parse(fileB);
  const fileAKeys = Object.keys(fileAJson);
  const fileBKeys = Object.keys(fileBJson);

  const removedAcc = fileAKeys.reduce((acc, key) => (_.has(fileBJson, key) ? acc : [...acc, ` - ${key}: ${fileAJson[key]}\n`]), []);
  const addedAcc = fileBKeys.reduce((acc, key) => (_.has(fileAJson, key) ? acc : [...acc, ` + ${key}: ${fileBJson[key]}\n`]), []);
  const changedAcc = fileAKeys.reduce((acc, key) => {
    if (_.has(fileBJson, key) && fileAJson[key] !== fileBJson[key]) {
      return [...acc, ` - ${key}: ${fileAJson[key]}\n`, ` + ${key}: ${fileBJson[key]}\n`];
    }
    if (_.has(fileBJson, key) && fileAJson[key] === fileBJson[key]) {
      return [...acc, `   ${key}: ${fileAJson[key]}\n`];
    }
    return acc;
  }, []);

  const removedString = prettifyResultList(removedAcc);
  const addedString = prettifyResultList(addedAcc);
  const changedString = prettifyResultList(changedAcc);
  const resultString = `{\n ${[...changedString]} ${[...removedString]} ${[...addedString]}}\n`.split(', ').join(' ');
  return resultString;
};
