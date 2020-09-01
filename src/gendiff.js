import _ from 'lodash';

const makeDiff = (objectA, objectB) => {
  const processKeys = (uniqKeys, fileAKeys, fileBKeys) => {
    const reduced = uniqKeys.reduce((acc, key) => {
      if (fileAKeys.includes(key) && !fileBKeys.includes(key)) {
        return [...acc, { type: 'removed', key, value: objectA[key] }];
      }
      if (!fileAKeys.includes(key) && fileBKeys.includes(key)) {
        return [...acc, { type: 'added', key, value: objectB[key] }];
      }
      if (objectA[key] === objectB[key]) {
        return [...acc, { type: 'unchanged', key, value: objectA[key] }];
      }
      if (!_.isObject(objectA[key]) || !_.isObject(objectB[key])) {
        if (objectA[key] !== objectB[key]) {
          return [...acc, {
            type: 'changed', key, beforeValue: objectA[key], afterValue: objectB[key],
          }];
        }
      }
      if (_.isObject(objectA[key]) && _.isObject(objectB[key])) {
        return [...acc, { type: 'nested', key, children: [makeDiff(objectA[key], objectB[key])] }];
      }
      return acc;
    }, []);
    return reduced;
  };
  const fileAKeys = Object.keys(objectA);
  const fileBKeys = Object.keys(objectB);

  const keys = _.union(fileAKeys, fileBKeys);

  return processKeys(keys, fileAKeys, fileBKeys);
};
export default makeDiff;
