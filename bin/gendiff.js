#!/usr/bin/env node

import pkg from 'commander';
import main from '../index.js';

const { program } = pkg;

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .option('-f, --format <type>', 'output format')
  .arguments('<first> <second>')
  .action((first, second) => {
    main(first, second);
  })
  .parse(process.argv);
