import _ from 'lodash';

const printValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plain = (diff) => {
  const iter = (node, ancestors) => node.reduce((acc, e) => {
    if (e.type === 'removed') {
      if (ancestors.length === 0) {
        return acc.concat(`Property '${e.key}' was removed\n`);
      }
      return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was removed\n`);
    }
    if (e.type === 'added') {
      if (ancestors.length === 0) {
        if (_.isObject(e.value)) {
          return acc.concat(`Property '${e.key}' was added with value: [complex value]\n`);
        }
        return acc.concat(`Property '${e.key}' was added with value: ${printValue(e.value)}\n`);
      }

      if (_.isObject(e.value)) {
        return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was added with value: [complex value]\n`);
      }
      return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was added with value: ${printValue(e.value)}\n`);
    }

    if (e.type === 'changed') {
      if (ancestors.length === 0) {
        if (_.isObject(e.beforeValue)) {
          return acc.concat(`Property '${e.key}' was updated. From [complex value] to ${printValue(e.afterValue)}\n`);
        }
        if (_.isObject(e.afterValue)) {
          return acc.concat(`Property '${e.key}' was updated. From ${printValue(e.beforeValue)} to [complex value]\n`);
        }
        if (!_.isObject(e.beforeValue) && !_.isObject(e.afterValue)) {
          return acc.concat(`Property '${e.key}' was updated. From ${printValue(e.beforeValue)} to ${printValue(e.afterValue)}\n`);
        }
      }
      if (_.isObject(e.beforeValue)) {
        return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was updated. From [complex value] to ${printValue(e.afterValue)}\n`);
      }
      if (_.isObject(e.afterValue)) {
        return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was updated. From ${printValue(e.beforeValue)} to [complex value]\n`);
      }
      if (!_.isObject(e.beforeValue) && !_.isObject(e.afterValue)) {
        return acc.concat(`Property '${ancestors.join('.')}.${e.key}' was updated. From ${printValue(e.beforeValue)} to ${printValue(e.afterValue)}\n`);
      }
    }
    if (e.type === 'nested') {
      return acc.concat(iter(e.children[0], [...ancestors, e.key]));
    }
    return acc;
  }, '');
  return iter(diff, []);
};

export default plain;
