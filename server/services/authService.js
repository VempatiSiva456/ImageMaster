const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { message: "Email already registered", status: 409 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return { message: "User successfully registered. Please log in." };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { message: "Unable to login", status: 400 };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { message: "Unable to login", status: 400 };
  }
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return { user, token };
};

exports.verifySession = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw { message: "User not found", status: 401 };
  }
  return user;
};
