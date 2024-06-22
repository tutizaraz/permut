const path = require('path');
const fs = require('fs').promises;
const { logError } = require('./logger');

async function processFiles(filesToProcess) {
  const filesToLoad = [];
  for (const item of filesToProcess) {
    try {
      const stats = await fs.lstat(item);
      if (stats.isDirectory()) {
        const entries = await fs.readdir(item, { withFileTypes: true });
        entries
          .filter((entry) => entry.isFile() && /\.(js|cjs)$/.test(entry.name))
          .forEach((entry) => filesToLoad.push(path.resolve(item, entry.name)));
      } else {
        filesToLoad.push(path.resolve(item));
      }
    } catch (error) {
      logError(`Error reading ${item}: ${error.message}`);
    }
  }
  return filesToLoad;
}

module.exports = { processFiles };
