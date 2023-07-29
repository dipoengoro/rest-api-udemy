const {validationResult} = require("express-validator");

exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [{
      _id      : "1",
      title    : "First Post",
      content  : "This is the first post!",
      imageUrl : "images/image.jpg",
      creator  : {
        name: "Dipoengoro"
      },
      createdAt: new Date()
    }]
  });
};

exports.postPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
              .json({
                message: "Validation failed, entered data is incorrect",
                errors : errors.array()
              });
  }
  const {
    title,
    content
  } = req.body;
  const date = new Date();
  res.status(201).json({
    message: "Post created successfully!",
    post   : {
      _id      : date.toISOString(),
      title    : title,
      content  : content,
      creator  : {
        name: "Dipoengoro"
      },
      createdAt: date
    }
  });
};