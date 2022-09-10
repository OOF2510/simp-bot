const { readdirSync, statSync } = require("fs");
const path = require("path");

module.exports = function getAllFiles(dirPath, arrayOfFiles) {
  files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, "../", dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};
