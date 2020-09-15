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
    switch (node.type) {
      case 'removed':
        return `Property '${keys.join('.')}' was removed`;
      case 'added':
        return `Property '${keys.join('.')}' was added with value: ${printValue(node.value)}`;
      case 'unchanged':
        return null;
      case 'changed':
        return `Property '${keys.join('.')}' was updated. From ${printValue(node.beforeValue)} to ${printValue(node.afterValue)}`;
      case 'nested':
        return iter(node.children, [...ancestors, node.key]);
      default:
        throw new Error('Unknown node type');
    }
  });
  return iter(diff, []).filter((e) => e).join('\n').trim();
};

export default plain;
