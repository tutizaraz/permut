#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { processFiles } = require('./utils/fileProcessor');
const { codeSwitching } = require('./utils/codeSwitching');
const { log, logError } = require('./utils/logger');
const colors = require('colors/safe');

const argv = yargs(hideBin(process.argv))
  .options({
    v: {
      type: 'boolean',
      alias: ['verbose'],
      describe: 'show verbose output',
      default: false,
    },
    p: {
      alias: ['parser'],
      type: 'string',
      describe: 'the parser that should be used with jscodeshift',
      choices: ['babel', 'babylon', 'flow', 'ts', 'tsx'],
      default: 'babel',
    },
  })
  .example([
    ['$0 index.js', 'convert a single file'],
    ['$0 lib/', 'convert all files in a directory'],
    ['$0 foo.js bar.js lib/', 'convert many files/directories'],
  ]).argv;

const filesToProcess = argv._;

if (!filesToProcess.length) {
  (async () => {
    await yargs.showHelp();
    process.exit(0);
  })();
}

const main = async () => {
  try {
    log(`${colors.rainbow('\nHey!')} Transforming your CommonJS to ESM...`);
    const filesToLoad = await processFiles(filesToProcess);

    log(`\nFound ${colors.cyan(filesToLoad.length.toString())} files.`);
    await codeSwitching(filesToLoad, argv);

    log(colors.rainbow('\nESMification complete!'));
    if (!argv.v) {
      log(`Re-run with ${colors.cyan('--verbose')} to see full output.`);
    }
    log();
  } catch (error) {
    logError(`Error during processing: ${error.message}`);
    logError(error.stack);
    process.exit(1);
  }
};

main();
