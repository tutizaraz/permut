#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { processFiles } = require('./fileProcessor');
const { codeSwitching } = require('./codeSwitching');
const { log, logError } = require('./logger');
const colors = require('colors/safe'); // Ensure colors is required

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
  yargs.showHelp();
  process.exit(0);
}

(async () => {
  try {
    log(`${colors.rainbow('\nAhoy!')} ES6ifyin' your CommonJS for ya...`);
    const filesToLoad = await processFiles(filesToProcess);

    log(`\nFound ${colors.cyan(filesToLoad.length.toString())} files.`);
    await codeSwitching(filesToLoad, argv);

    log(colors.rainbow('\nES6ification complete!'));
    if (!argv.v) {
      log(`Re-run with ${colors.cyan('--verbose')} to see full output.`);
    }
    log();
  } catch (error) {
    logError(error.stack);
    process.exit(1);
  }
})();
