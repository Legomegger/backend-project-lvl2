import _ from 'lodash';

const space = ' ';

const renderValue = (value, indentation) => {
  if (_.isObject(value)) {
    const entries = Object.entries(value);
    const reduced = entries.reduce((acc, [key, val]) => acc.concat(`${space.repeat(indentation + 6)}${key}: ${renderValue(val, indentation + 4)}\n`), '');
    return `{\n${reduced}${space.repeat(indentation + 2)}}`;
  }
  return value;
};

const stylish = (diff) => {
  const iter = (diffObject, indentation) => diffObject.map((node) => {
    if (node.type === 'removed') {
      return `${space.repeat(indentation)}- ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'added') {
      return `${space.repeat(indentation)}+ ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'unchanged') {
      return `${space.repeat(indentation)}  ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'changed') {
      return `${space.repeat(indentation)}- ${node.key}: ${renderValue(node.beforeValue, indentation)}\n${space.repeat(indentation)}+ ${node.key}: ${renderValue(node.afterValue, indentation)}`;
    }
    return `${space.repeat(indentation)}  ${node.key}: {\n${iter(node.children, indentation + 4).join('\n')}\n${space.repeat(indentation + 2)}}`;
  });
  return `{\n${iter(diff, 2).join('\n')}\n}`;
};

export default stylish;
