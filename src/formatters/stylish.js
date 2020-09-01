import _ from 'lodash';

const space = ' ';

const printObject = (object, indentation = 2, spacer = ' ') => {
  const entries = Object.entries(object);
  return entries.reduce((acc, [key, value]) => {
    if (_.isObject(value)) {
      return acc.concat(`${spacer.repeat(indentation + 2)}${key}: {\n${printObject(value, indentation + 4)}${spacer.repeat(indentation + 2)}}\n`);
    }
    return acc.concat(`${spacer.repeat(indentation + 2)}${key}: ${value}\n`);
  }, '');
};

const displayResult = (node, indentation, symbol) => {
  if (_.isObject(node.value)) {
    return `${space.repeat(indentation)}${symbol} ${node.key}: {\n${printObject(node.value, indentation + 4)}${space.repeat(indentation)}  }\n`;
  }
  return `${space.repeat(indentation)}${symbol} ${node.key}: ${node.value}\n`;
};

const stylish = (diff, ind) => {
  const result = diff.reduce((acc, node) => {
    if (node.type === 'removed') {
      return acc.concat(displayResult(node, ind, '-'));
    }
    if (node.type === 'added') {
      return acc.concat(displayResult(node, ind, '+'));
    }
    if (node.type === 'unchanged') {
      return acc.concat(displayResult(node, ind, ' '));
    }
    if (node.type === 'changed') {
      if (_.isObject(node.beforeValue) && _.isObject(node.afterValue)) {
        return acc.concat(`${space.repeat(ind)}- ${node.key}: {\n${printObject(node.beforeValue, ind + 4)}}\n${space.repeat(ind)}+ ${node.key}: {\n${printObject(node.afterValue, ind + 4)}}\n`);
      }

      if (!_.isObject(node.beforeValue) && !_.isObject(node.afterValue)) {
        return acc.concat(`${space.repeat(ind)}- ${node.key}: ${node.beforeValue}\n${space.repeat(ind)}+ ${node.key}: ${node.afterValue}\n`);
      }

      if (!_.isObject(node.beforeValue) && _.isObject(node.afterValue)) {
        return acc.concat(`${space.repeat(ind)}- ${node.key}: ${node.beforeValue}\n${space.repeat(ind)}+ ${node.key}: {\n${printObject(node.afterValue, ind + 4)}${space.repeat(ind)}  }\n`);
      }

      if (_.isObject(node.beforeValue) && !_.isObject(node.afterValue)) {
        return acc.concat(`${space.repeat(ind)}- ${node.key}: {\n${printObject(node.beforeValue, ind + 4)}${space.repeat(ind)}  }\n${space.repeat(ind)}+ ${node.key}: ${node.afterValue}\n`);
      }
    }
    if (node.type === 'nested') {
      return acc.concat(`${space.repeat(ind)}  ${node.key}: {\n${stylish(node.children[0], ind + 4)}${space.repeat(ind)}  }\n`);
    }
    return acc;
  }, '');
  return result;
};

const wrapResult = (diff) => `{\n${stylish(diff, 2)}}`;

export default wrapResult;
