const User = require("../models/user");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const {handle} = require("../util/error");
const jwt = require("jsonwebtoken");
const {load} = require("nodemon/lib/rules");

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email   : email,
            password: hashedPassword,
            name    : name
          });
          return user.save();
        })
        .then(result => res.status(201).json({
          message: "User created!",
          userId : result._id
        })).catch(e => handle(e, req, res, next));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({email: email})
      .exec()
      .then(user => {
        if (!user) {
          const e = new Error("A user with this email could not be found.");
          e.statusCode = 401;
          throw e;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then(result => {
        if (!result) {
          const e = new Error("Wrong password!");
          e.statusCode = 401;
          throw e;
        }
        const token = jwt.sign({
          email : loadedUser,
          userId: loadedUser._id.toString()
        }, process.env.SECRET, {expiresIn: "1h"});
        res.status(200).json({
          token : token,
          userId: loadedUser._id.toString()
        });
      })
      .catch(e => handle(e, req, res, next));
};