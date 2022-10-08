const { readdirSync, statSync } = require("fs");
const path = require("path");

/**
 * Returns an array of all the files in given directory and subdirectories
 * @param {string} dirPath
 * @param {Array} arrayOfFiles
 * @returns {Array}
 */
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
