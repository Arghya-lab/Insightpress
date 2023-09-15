const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtKey = process.env.JWT_SECRET;

const signupUser = async (req, res) => {
  // req.file is the `avatarImg` file
  try {
    // req.body will hold the text fields
    const { name, email, avatarImgName, bio, password } = req.body
    const salt = bcrypt.genSaltSync(8);
    const hashPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({
      name,
      email,
      avatarImgName,
      bio,
      password: hashPassword,
      bookmarks: [],
    });
    const token = jwt.sign({ id: user._id, name: user.name, email }, jwtKey);
    res.status(200).send({ name: user.name, id: user._id, avatarImgName, token });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isCorrectPass = bcrypt.compareSync(password, user.password);
    if (isCorrectPass) {
      const token = jwt.sign({  id: user._id, name: user.name, email }, jwtKey);
      res.status(200).json({ name: user.name, id: user._id, bookmarks: user.bookmarks, token });
    } else {
      res.status(400).json("Incorrect credentials");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { signupUser, loginUser };
