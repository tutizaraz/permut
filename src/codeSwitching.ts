import os from 'os';
import { spawn } from 'child_process';
import { log, logError } from './logger';

async function runCodeshift(
  transformName: string,
  files: string[],
  parser: string,
  verbose: boolean
): Promise<void> {
  try {
    const cmd = require.resolve('jscodeshift/bin/jscodeshift.sh');
    const transform = require.resolve(transformName);
    const args = ['-c', os.cpus().length.toString(), '--parser', parser, '-t', transform, ...files];

    const child = spawn(cmd, args);

    child.stdout.on('data', (data: Buffer) => {
      if (verbose) {
        process.stdout.write(data);
      } else if (/^Results: /.test(data.toString())) {
        log(data.toString().trim());
      }
    });

    child.stderr.on('data', (data: Buffer) => {
      process.stderr.write(data);
    });

    await new Promise<void>((resolve, reject) => {
      child.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`jscodeshift process exited with code ${code}`));
        }
      });
    });
  } catch (error: any) {
    logError(error.message);
    throw error;
  }
}
interface Argv {
  p: string;
  v: boolean;
}

async function codeSwitching(files: string[], argv: Argv): Promise<void> {
  const colors = {
    yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
    cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
    red: (text: string) => `\x1b[31m${text}\x1b[0m`,
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

export { codeSwitching };
