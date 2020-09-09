import _ from 'lodash';

const space = ' ';

const getIndent = (depth, by = 0) => depth + by;

const renderValue = (value, indentation) => {
  if (!_.isObject(value)) {
    return value;
  }
  const entries = Object.entries(value);
  const mapped = entries.map(([key, val]) => {
    const line = `${space.repeat(indentation + 6)}${key}: ${renderValue(val, indentation + 4)}`;
    return line;
  });
  return `{\n${mapped.join('\n')}\n${space.repeat(indentation + 2)}}`;
};

const stylish = (diff) => {
  const iter = (diffObject, depth) => diffObject.map((node) => {
    switch (node.type) {
      case 'removed':
        return `${space.repeat(getIndent(depth))}- ${node.key}: ${renderValue(node.value, getIndent(depth))}`;
      case 'added':
        return `${space.repeat(getIndent(depth))}+ ${node.key}: ${renderValue(node.value, getIndent(depth))}`;
      case 'unchanged':
        return `${space.repeat(getIndent(depth))}  ${node.key}: ${renderValue(node.value, getIndent(depth))}`;
      case 'changed':
        return `${space.repeat(getIndent(depth))}- ${node.key}: ${renderValue(node.beforeValue, getIndent(depth))}\n${space.repeat(getIndent(depth))}+ ${node.key}: ${renderValue(node.afterValue, getIndent(depth))}`;
      default:
        return `${space.repeat(getIndent(depth))}  ${node.key}: {\n${iter(node.children, depth + 4).join('\n')}\n${space.repeat(getIndent(depth + 2))}}`;
    }
  });
  return `{\n${iter(diff, 2).join('\n')}\n}`;
};

export default stylish;
