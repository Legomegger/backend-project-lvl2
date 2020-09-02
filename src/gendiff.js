import _ from 'lodash';

const makeDiff = (object1, object2) => {
  const file1Keys = Object.keys(object1);
  const file2Keys = Object.keys(object2);

  const keys = _.union(file1Keys, file2Keys);

  const mapped = keys.map((key) => {
    if (!_.has(object2, key)) {
      return { type: 'removed', key, value: object1[key] };
    }
    if (!_.has(object1, key)) {
      return { type: 'added', key, value: object2[key] };
    }
    if (object1[key] === object2[key]) {
      return { type: 'unchanged', key, value: object1[key] };
    }
    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      return { type: 'nested', key, children: makeDiff(object1[key], object2[key]) };
    }
    return {
      type: 'changed', key, beforeValue: object1[key], afterValue: object2[key],
    };
  });
  return mapped;
};
export default makeDiff;
