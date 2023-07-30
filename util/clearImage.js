const fs = require("fs");
const path = require("path");
const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, e => console.log(e));
};

module.exports = clearImage;