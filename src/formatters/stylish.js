import _ from 'lodash';

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
  const result = diff.reduce((acc, e) => {
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
  return result;
};

const wrapResult = (diff) => `{\n${stylish(diff, 2)}}`;

export default wrapResult;
