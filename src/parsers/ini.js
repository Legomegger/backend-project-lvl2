import ini from 'ini';
import _ from 'lodash';

const printValue = (value) => (parseFloat(value) ? parseFloat(value) : value);

const correctValue = (object) => {
  const entries = Object.entries(object);
  return entries.reduce((acc, [key, value]) => {
    if (!_.isObject(value)) {
      return { ...acc, [key]: printValue(value) };
    }
    return { ...acc, [key]: correctValue(value) };
  }, {});
};

export default (rawData) => correctValue(ini.parse(rawData));
