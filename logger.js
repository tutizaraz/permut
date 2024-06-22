const colors = require('colors/safe');

function log(message) {
  console.log(message);
}

function logError(message) {
  console.error(colors.red(message));
}

module.exports = { log, logError, colors };
