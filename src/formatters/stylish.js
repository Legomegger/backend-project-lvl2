import _ from 'lodash';

const space = ' ';

const printObject = (object, indentation = 2) => {
  const entries = Object.entries(object);
  return entries.reduce((acc, [key, value]) => {
    if (_.isObject(value)) {
      return acc.concat(`${space.repeat(indentation + 2)}${key}: {\n${printObject(value, indentation + 8)}${space.repeat(indentation + 4)}}\n`);
    }
    return acc.concat(`${space.repeat(indentation + 2)}${key}: ${value}\n`);
  }, '');
};

const renderValue = (value, indentation) => {
  if (_.isObject(value)) {
    return `{\n${space.repeat(indentation + 2)}${printObject(value, indentation)}${space.repeat(indentation + 2)} }`;
  }
  return value;
};

const stylish = (diff) => {
  const iter = (diffObject, indentation) => diffObject.map((node) => {
    if (node.type === 'removed') {
      return `${space.repeat(indentation)} - ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'added') {
      return `${space.repeat(indentation)} + ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'unchanged') {
      return `${space.repeat(indentation)}  ${node.key}: ${renderValue(node.value, indentation)}`;
    }
    if (node.type === 'changed') {
      return `${space.repeat(indentation)} - ${node.key}: ${renderValue(node.beforeValue, indentation)}\n ${space.repeat(indentation)} + ${node.key}: ${renderValue(node.afterValue, indentation)}`;
    }
    return `${space.repeat(indentation)}   ${node.key}: {\n ${iter(node.children, indentation + 2).join('\n')}${space.repeat(indentation + 2)}\n}`;
  });
  return iter(diff, 2);
};

const wrapResult = (diff) => console.log(stylish(diff)[0]);

export default wrapResult;
