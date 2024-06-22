const fs = require('fs');
const path = require('path');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

function logFileContent(filePath) {
  readFileAsync(filePath, 'utf8')
    .then((content) => {
      console.log(content);
    })
    .catch((error) => {
      console.error(`Error reading file: ${error.message}`);
    });
}

module.exports = {
  logFileContent,
  constantValue: 42,
};
