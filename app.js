require("dotenv").config();
const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const {v4} = require("uuid");

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename   : (req, file, callback) => {
    callback(null, `${v4()}.${file.mimetype.substring(file.mimetype.indexOf("/") + 1)}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({
  storage   : fileStorage,
  fileFilter: fileFilter
}).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use((e, req, res, next) => {
  const status = e.statusCode || 500;
  const message = e.message;
  res.status(status).json({message: message});
});

mongoose.connect(process.env.MONGODB_URI)
        .then(() => app.listen(process.env.PORT))
        .catch(e => console.log(e));