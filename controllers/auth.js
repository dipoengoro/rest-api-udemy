const User = require("../models/user");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  handle,
  checkValidation
} = require("../util/error");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  checkValidation(validationResult(req));
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email   : email,
      password: hashedPassword,
      name    : name
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created!",
      userId : result._id
    });
  } catch (e) {
    handle(e, next);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({email: email}).exec();
    if (!user) {
      const e = new Error("A user with this email could not be found.");
      e.statusCode = 401;
      throw e;
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      const e = new Error("Wrong password!");
      e.statusCode = 401;
      throw e;
    }
    const token = await jwt.sign({
      email : user,
      userId: user._id.toString()
    }, process.env.SECRET, {expiresIn: "1h"});
    res.status(200).json({
      token : token,
      userId: user._id.toString()
    });
  } catch (e) {
    handle(e, next);
  }
};