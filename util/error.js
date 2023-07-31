const Post = require("../models/post");
const User = require("../models/user");
exports.handle = (e, next) => {
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  next(e);
};

exports.checkPostAndCreator = async (req) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) {
    const error = new Error("Could not find post.");
    error.statusCode = 404;
    throw error;
  }
  if (post.creator.toString() !== req.userId) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    throw error;
  }
  return post;
};

exports.checkPost = async (req) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) {
    const error = new Error("Could not find post.");
    error.statusCode = 404;
    throw error;
  }
  return post;
};

exports.checkUser = async (req) => {
  const user = await User.findById(req.userId).exec();
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

exports.checkValidation = (validation) => {
  const errors = validation;
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  return errors;
};

exports.checkFile = (req) => {
  if (!req.file) {
    const e = new Error("No image provided.");
    e.statusCode = 422;
    throw e;
  }
};

exports.checkNoFile = (image) => {
  if (!image) {
    const e = new Error("No file picked.");
    e.statusCode = 422;
    throw e;
  }
};