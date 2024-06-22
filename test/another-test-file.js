function logFileContent(filePath) {
  readFileAsync(filePath, 'utf8')
    .then((content) => {
      console.log(content);
    })
    .catch((error) => {
      console.error(`Error reading file: ${error.message}`);
    });
}

export default {
  logFileContent,
  constantValue: 42,
};
