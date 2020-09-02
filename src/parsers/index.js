import parseJson from './json.js';
import parseYml from './yml.js';
import parseIni from './ini.js';

const getParser = (fileType) => {
  const extension = fileType.split('.')[1];
  const extensions = {
    ini: (contents) => parseIni(contents),
    yml: (contents) => parseYml(contents),
    yaml: (contents) => parseYml(contents),
    json: (contents) => parseJson(contents),
  };
  if (extensions[extension]) {
    return extensions[extension];
  }
  return null;
};

export default (fileType, fileContent) => {
  const parse = getParser(fileType);
  return parse ? parse(fileContent) : null;
};
