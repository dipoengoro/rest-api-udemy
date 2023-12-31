const mongoose = require("mongoose");
const {
  post,
  user
} = require("../util/models");
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
    type    : Schema.Types.ObjectId,
    ref     : user,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model(post, postSchema);