import path from 'path';
import { promises as fs } from 'fs';
import { logError } from './logger';

async function processFiles(filesToProcess: string[]): Promise<string[]> {
  const filesToLoad: string[] = [];
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
      logError(`Error reading ${item}: ${(error as Error).message}`);
    }
  }
  return filesToLoad;
}

export { processFiles };
