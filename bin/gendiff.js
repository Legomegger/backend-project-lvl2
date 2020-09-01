#!/usr/bin/env node

import path from 'path';
import pkg from 'commander';
import main from '../index.js';

const { program } = pkg;

const relativePath = (filepath) => !filepath.includes(path.resolve());

const normalizePath = (filepath) => {
  if (relativePath(filepath)) {
    return `${path.resolve()}/${filepath}`;
  }
  return filepath;
};

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const fileA = normalizePath(filepath1);
    const fileB = normalizePath(filepath2);
    console.log(main(fileA, fileB, program.format));
  })
  .parse(process.argv);
