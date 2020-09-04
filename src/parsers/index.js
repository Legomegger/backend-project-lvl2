import parseJson from './json.js';
import parseYml from './yml.js';
import parseIni from './ini.js';

const formats = {
  ini: (content) => parseIni(content),
  yml: (content) => parseYml(content),
  yaml: (content) => parseYml(content),
  json: (content) => parseJson(content),
};

export default (dataFormat, fileContent) => formats[dataFormat](fileContent);
