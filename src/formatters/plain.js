import _ from 'lodash';

const printValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plain = (diff) => {
  const iter = (diffObject, ancestors) => diffObject.flatMap((node) => {
    const keys = [...ancestors, node.key];
    if (node.type === 'removed') {
      return `Property '${keys.join('.')}' was removed`;
    }
    if (node.type === 'added') {
      return `Property '${keys.join('.')}' was added with value: ${printValue(node.value)}`;
    }
    if (node.type === 'unchanged') {
      return null;
    }
    if (node.type === 'changed') {
      return `Property '${keys.join('.')}' was updated. From ${printValue(node.beforeValue)} to ${printValue(node.afterValue)}`;
    }
    return iter(node.children, [...ancestors, node.key]);
  });
  return iter(diff, []).filter((e) => e).join('\n').trim();
};

export default plain;
