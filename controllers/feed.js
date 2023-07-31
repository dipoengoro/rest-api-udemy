const {validationResult} = require("express-validator");
const Post = require("../models/post");
const {
  handle,
  checkPostAndCreator,
  checkPost,
  checkUser,
  checkValidation,
  checkFile,
  checkNoFile
} = require("../util/error");
const clearImage = require("../util/clearImage");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({
      message   : "Fetched posts successfully.",
      posts     : posts,
      totalItems: totalItems
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await checkPost(req);
    res.status(200).json({
      message: "Post fetched.",
      post   : post
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.postPost = async (req, res, next) => {
  checkValidation(validationResult(req));
  checkFile(req);
  const imageUrl = req.file.path.replace("\\", "/");
  const {
    title,
    content
  } = req.body;
  const post = new Post({
    title   : title,
    content : content,
    imageUrl: imageUrl,
    creator : req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId).exec();
    await user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "Post created successfully",
      post   : post,
      creator: {
        _id : user._id,
        name: user.name
      }
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.putPost = async (req, res, next) => {
  const id = req.params.id;
  checkValidation(validationResult(req));
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  checkNoFile(imageUrl);
  try {
    const post = await checkPostAndCreator(req);
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    await post.save();
    res.status(200).json({
      message: "Post updated!",
      post   : post
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await checkPostAndCreator(req);
    await clearImage(post.imageUrl);
    await Post.findByIdAndRemove(id);
    const user = await User.findById(req.userId).exec();
    await user.posts.pull(id);
    await user.save();
    res.status(200).json({message: "Deleted post."});
  } catch (e) {
    handle(e, next);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const user = await checkUser(req);
    res.status(200).json({
      message: "Success",
      status : user.status
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.patchStatus = async (req, res, next) => {
  try {
    const user = await checkUser(req);
    user.status = req.body.status;
    await user.save();
    res.status(201).json({message: "Status updated."});
  } catch (e) {
    handle(e, next);
  }
};