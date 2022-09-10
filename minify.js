const uglify = require("uglify-js");
const {
  existsSync,
  mkdirSync,
  writeFile,
  readFileSync,
  copyFile,
} = require("fs");

const path = require("path");

const cmdFiles = require("./util/getAllFiles")("./cmds").filter((File) =>
  File.endsWith(".js")
);

for (const File of cmdFiles) {
  let file = readFileSync(`${File}`, "utf-8");
  let fileName = path.basename(File).split(".")[0];
  var result = uglify.minify(file);

  if (result.error) {
    console.error("Error minifying: " + result.error);
  }

  if (!existsSync("./minified")) {
    mkdirSync("./minified");
  }

  if (!existsSync("./minified/cmds")) {
    mkdirSync("./minified/cmds");
  }

  writeFile(`./minified/cmds/${fileName}.min.js`, result.code, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("File was successfully saved.");
    }
  });
}

const index = readFileSync("./index.js", "utf-8");

var result = uglify.minify(index);

if (result.error) {
  console.error("Error minifying: " + result.error);
}

writeFile(`./minified/index.min.js`, result.code, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("File was successfully saved.");
  }
});

["./config.json", "./config.dev.json", "package.json", "yarn.lock"].forEach(
  (file) => {
    if (!existsSync(file)) return;
    readFileSync(file);

    copyFile(file, `./minified/${file}`, (err) => {
      if (err) {
        console.log(`Error Copying ${file}`, err);
      } else {
        console.log(`Copied file ${file}`);
      }
    });
  }
);
