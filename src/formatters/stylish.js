import _ from 'lodash';

const space = ' ';

const getIndent = (depth) => space.repeat(depth);

const renderValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  const entries = Object.entries(value);
  const mapped = entries.map(([key, val]) => {
    const line = `${space.repeat(depth + 6)}${key}: ${renderValue(val, depth + 4)}`;
    return line;
  });
  return `{\n${mapped.join('\n')}\n${space.repeat(depth + 2)}}`;
};

const stylish = (diff) => {
  const iter = (diffObject, depth) => diffObject.map((node) => {
    switch (node.type) {
      case 'removed':
        return `${getIndent(depth)}- ${node.key}: ${renderValue(node.value, depth)}`;
      case 'added':
        return `${getIndent(depth)}+ ${node.key}: ${renderValue(node.value, depth)}`;
      case 'unchanged':
        return `${getIndent(depth)}  ${node.key}: ${renderValue(node.value, depth)}`;
      case 'changed':
        return `${getIndent(depth)}- ${node.key}: ${renderValue(node.beforeValue, depth)}\n${getIndent(depth)}+ ${node.key}: ${renderValue(node.afterValue, depth)}`;
      default:
        return `${getIndent(depth)}  ${node.key}: {\n${iter(node.children, depth + 4).join('\n')}\n${getIndent(depth + 2)}}`;
    }
  });
  return `{\n${iter(diff, 2).join('\n')}\n}`;
};

export default stylish;
