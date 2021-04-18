const config = require("../config.json");
const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    port: config.port,
  });
});

app.listen(config.port, () =>
  console.log(`WebServer is up on port ${config.port}`)
);
