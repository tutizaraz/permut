import colors from 'colors/safe';

function log(message: string): void {
  console.log(message);
}

function logError(message: string): void {
  console.error(colors.red(message));
}

export { log, logError, colors };
