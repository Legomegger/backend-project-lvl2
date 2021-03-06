import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const types = {
  stylish: (diff) => stylish(diff),
  plain: (diff) => plain(diff).trim(),
  json: (diff) => json(diff).trim(),
};

export default (diff, type) => types[type](diff);
