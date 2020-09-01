import YAML from 'yaml';
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
export const parseJson = (rawData) => JSON.parse(rawData);

export const parseYml = (rawData) => YAML.parse(rawData);

export const parseIni = (rawData) => correctValue(ini.parse(rawData));
