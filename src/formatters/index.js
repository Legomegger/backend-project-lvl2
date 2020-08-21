import stylish from './stylish.js';
import plain from './plain.js';

const types = {
  stylish: (diff) => `{\n${stylish(diff, 2)}}`,
  plain: (diff) => plain(diff),
};

const format = (diff, type) => types[type](diff);

export default format;
