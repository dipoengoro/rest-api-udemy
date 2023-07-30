const {validationResult} = require("express-validator");
const Post = require("../models/post");
const {handle} = require("../util/error");
const clearImage = require("../util/clearImage");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Post.find().skip((currentPage - 1) * perPage).limit(perPage);
      })
      .then(posts => res.status(200).json({
        message   : "Fetched posts successfully.",
        posts     : posts,
        totalItems: totalItems
      }))
      .catch(e => handle(e, req, res, next));
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
      .exec()
      .then(result => {
        if (!result) {
          const e = new Error("Could not find post.");
          e.statusCode = 404;
          throw e;
        }
        res.status(200).json({
          message: "Post fetched.",
          post   : result
        });
      })
      .catch(e => handle(e, req, res, next));
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const e = new Error("No image provided.");
    e.statusCode = 422;
    throw e;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const {
    title,
    content
  } = req.body;
  const post = new Post({
    title   : title,
    content : content,
    imageUrl: imageUrl,
    creator : {name: "Dipoengoro"}
  });
  post.save()
      .then(result => {
        res.status(201).json({
          message: "Post created successfully",
          post   : result
        });
      })
      .catch(e => handle(e, req, res, next));
};

exports.putPost = (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const e = new Error("No file picked.");
    e.statusCode = 422;
    throw e;
  }
  Post.findById(id)
      .exec()
      .then(result => {
        if (!result) {
          const error = new Error("Could not find post.");
          error.statusCode = 404;
          throw error;
        }
        if (imageUrl !== result.imageUrl) {
          clearImage(result.imageUrl);
        }
        result.title = title;
        result.imageUrl = imageUrl;
        result.content = content;
        return result.save();
      })
      .then(result => res.status(200).json({
        message: "Post updated!",
        post   : result
      }))
      .catch(e => handle(e, req, res, next));
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
      .exec()
      .then(result => {
        if (!result) {
          const error = new Error("Could not find post.");
          error.statusCode = 404;
          throw error;
        }
        clearImage(result.imageUrl);
        return Post.findByIdAndRemove(id);
      })
      .then(() => res.status(200).json({message: "Deleted post."}))
      .catch(e => handle(e, req, res, next));
};