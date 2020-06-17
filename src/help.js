import pkg from 'commander';

const { program } = pkg;
export default () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference')
    .option('-f, --format <type>', 'output format')
    .parse(process.argv);
};
