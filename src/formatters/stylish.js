import _ from 'lodash';

const space = ' ';

const printObject = (object, indentation = 2) => {
  const entries = Object.entries(object);
  return entries.reduce((acc, [key, value]) => {
    if (_.isObject(value)) {
      return acc.concat(`${space.repeat(indentation + 6)}${key}: {\n${printObject(value, indentation + 4)}${space.repeat(indentation + 6)}}\n`);
    }
    return acc.concat(`${space.repeat(indentation + 6)}${key}: ${value}\n`);
  }, '');
};

const renderValue = (value, indentation) => {
  if (_.isObject(value)) {
    return `{\n${printObject(value, indentation)}${space.repeat(indentation + 2)}}`;
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
  const result = iter(diff, 2);
  return `{\n${result.join('\n')}\n}`;
};

export default stylish;
