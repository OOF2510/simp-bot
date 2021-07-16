const uglify = require("uglify-js");
const fs = require("fs");
const path = require("path");

const cmdFiles = fs
  .readdirSync("./cmds")
  .filter((File) => File.endsWith(".js"));

for (const File of cmdFiles) {
  let file = fs.readFileSync(`./cmds/${File}`, "utf-8");
  let fileName = path.basename(File).split(".")[0];
  var result = uglify.minify(file);

  if (result.error) {
    console.error("Error minifying: " + result.error);
  }

  if (!fs.existsSync("./minified")) {
    fs.mkdirSync("./minified");
  }

  if (!fs.existsSync("./minified/cmds")) {
    fs.mkdirSync("./minified/cmds");
  }

  fs.writeFile(
    `./minified/cmds/${fileName}.min.js`,
    result.code,
    function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File was successfully saved.");
      }
    }
  );
}

const index = fs.readFileSync("./index.js", "utf-8");

var result = uglify.minify(index);

if (result.error) {
  console.error("Error minifying: " + result.error);
}

fs.writeFile(`./minified/index.min.js`, result.code, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("File was successfully saved.");
  }
});

["./config.json", "./config.dev.json"].forEach((file) => {
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file);

  fs.copyFile(file, `./minified/${file}`, (err) => {
    if (err) {
      console.log(`Error Copying ${file}`, err);
    } else {
      console.log(`Copied file ${file}`);
    }
  });
});
