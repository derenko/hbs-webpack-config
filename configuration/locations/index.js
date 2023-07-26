const fs = require("fs");
const path = require("path");

const ROOT = ".";

const CONFIGURATION = path.resolve(ROOT, "configuration");

const CONFIGURATION_HBS = path.resolve(CONFIGURATION, "hbs", "index.js");

const PAGES = fs.readdirSync(path.join(ROOT, "src/pages")).map((name) => ({
  path: path.resolve(ROOT, "src", "pages", name),
  name: name.replace("hbs", "html"),
}));

const PARTIALS = fs
  .readdirSync(path.join(ROOT, "src/partials"))
  .map((name) => path.resolve(ROOT, "src", "partials", name));

const ASSETS = path.resolve(ROOT, "src", "assets");

const SERVER = path.resolve(ROOT, "src", "server");

const FONTS = path.resolve(ASSETS, "fonts");

const IMAGES = path.resolve(ASSETS, "images");

const FILES = path.resolve(ASSETS, "files");

module.exports = {
  CONFIGURATION,
  CONFIGURATION_HBS,
  PAGES,
  PARTIALS,
  ASSETS,
  FONTS,
  IMAGES,
  FILES,
  SERVER,
};
