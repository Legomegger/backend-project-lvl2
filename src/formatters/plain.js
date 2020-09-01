import _ from 'lodash';

const printValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plain = (diff) => {
  const iter = (diffObject, ancestors) => diffObject.reduce((acc, node) => {
    const keys = [...ancestors, node.key];
    if (node.type === 'removed') {
      return acc.concat(`Property '${keys.join('.')}' was removed\n`);
    }
    if (node.type === 'added') {
      if (_.isObject(node.value)) {
        return acc.concat(`Property '${keys.join('.')}' was added with value: [complex value]\n`);
      }
      return acc.concat(`Property '${keys.join('.')}' was added with value: ${printValue(node.value)}\n`);
    }

    if (node.type === 'changed') {
      if (_.isObject(node.beforeValue)) {
        return acc.concat(`Property '${keys.join('.')}' was updated. From [complex value] to ${printValue(node.afterValue)}\n`);
      }
      if (_.isObject(node.afterValue)) {
        return acc.concat(`Property '${keys.join('.')}' was updated. From ${printValue(node.beforeValue)} to [complex value]\n`);
      }
      if (!_.isObject(node.beforeValue) && !_.isObject(node.afterValue)) {
        return acc.concat(`Property '${keys.join('.')}' was updated. From ${printValue(node.beforeValue)} to ${printValue(node.afterValue)}\n`);
      }
    }
    if (node.type === 'nested') {
      return acc.concat(iter(node.children[0], [...ancestors, node.key]));
    }
    return acc;
  }, '');
  return iter(diff, []);
};

export default plain;
