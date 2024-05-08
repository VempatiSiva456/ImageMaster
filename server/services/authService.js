const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error({ message: "Email already registered", status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return { message: "User successfully registered. Please log in." };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ message: "Unable to login", status: 400 });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error({ message: "Unable to login", status: 400 });
  }
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return { user, token };
};

exports.verifySession = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new Error({ message: "User not found", status: 401 });
  }
  return user;
};

exports.getUsers = async () => {
  try {
    const all_users = await User.find();
    if (!all_users.length){
      throw new Error({ message: "No users found", status: 401 });
    }
    return all_users;
  }
  catch (error){
    console.error("Error fetching users:", error);
    throw new Error({ message: "Failed to retrieve users", status: error.status || 500 });
  }
}
