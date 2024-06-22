const os = require('os');
const { spawn } = require('child_process');
const { log, logError } = require('./logger');

async function runCodeshift(transformName, files, parser, verbose) {
  try {
    const cmd = require.resolve('jscodeshift/bin/jscodeshift.sh');
    const transform = require.resolve(transformName);
    const args = ['-c', os.cpus().length, '--parser', parser, '-t', transform, ...files];

    const child = spawn(cmd, args);

    child.stdout.on('data', (data) => {
      if (verbose) {
        process.stdout.write(data);
      } else if (/^Results: /.test(data.toString())) {
        log(data.toString().trim());
      }
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`jscodeshift process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    logError(error.message);
    throw error;
  }
}

async function codeSwitching(files, argv) {
  const colors = log.colors || {
    yellow: (text) => text,
    cyan: (text) => text,
    red: (text) => text,
  };

  log(`Transforming ${colors.yellow('require()')} to ${colors.cyan('import')} ...`);
  await runCodeshift('5to6-codemod/transforms/cjs.js', files, argv.p, argv.v);

  log(
    `Transforming ${colors.yellow('module.exports')}/${colors.red('exports')} to ${colors.cyan(
      'export'
    )} ...`
  );
  await runCodeshift('5to6-codemod/transforms/exports.js', files, argv.p, argv.v);
}

module.exports = { codeSwitching };
