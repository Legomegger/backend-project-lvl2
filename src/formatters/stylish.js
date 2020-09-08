import _ from 'lodash';

const space = ' ';

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
  const iter = (diffObject, indentation) => diffObject.map((node) => {
    switch (node.type) {
      case 'removed':
        return `${space.repeat(indentation)}- ${node.key}: ${renderValue(node.value, indentation)}`;
      case 'added':
        return `${space.repeat(indentation)}+ ${node.key}: ${renderValue(node.value, indentation)}`;
      case 'unchanged':
        return `${space.repeat(indentation)}  ${node.key}: ${renderValue(node.value, indentation)}`;
      case 'changed':
        return `${space.repeat(indentation)}- ${node.key}: ${renderValue(node.beforeValue, indentation)}\n${space.repeat(indentation)}+ ${node.key}: ${renderValue(node.afterValue, indentation)}`;
      default:
        return `${space.repeat(indentation)}  ${node.key}: {\n${iter(node.children, indentation + 4).join('\n')}\n${space.repeat(indentation + 2)}}`;
    }
  });
  return `{\n${iter(diff, 2).join('\n')}\n}`;
};

export default stylish;
