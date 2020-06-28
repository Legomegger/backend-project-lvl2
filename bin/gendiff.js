#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import pkg from 'commander';
import main from '../index.js';

const { program } = pkg;

const relativePath = (filepath) => !filepath.includes(path.resolve());
// const getFileName = (filepath) => filepath.split('/')[filepath.split('/').length - 1];

const normalizePath = (filepath) => {
  if (relativePath(filepath)) {
    return `${path.resolve()}/${filepath}`;
  }
  return filepath;
};

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const fileA = fs.readFileSync(normalizePath(filepath1), 'utf-8');
    const fileB = fs.readFileSync(normalizePath(filepath2), 'utf-8');
    console.log(main(fileA, fileB));
  })
  .parse(process.argv);
