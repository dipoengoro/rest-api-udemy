const mongoose = require("mongoose");
const {post} = require("../util/models");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title   : {
    type    : String,
    required: true
  },
  imageUrl: {
    type    : String,
    required: true
  },
  content : {
    type    : String,
    required: true
  },
  creator : {
    type    : Object,
    required: String
  }
}, {timestamps: true});

module.exports = mongoose.model(post, postSchema);