const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: {
    type: String,
    enum: ['user', 'admin']
  },
  password: { 
    type: String, 
    required: true 
  }
});

const User = mongoose.model('Tool_User', userSchema);

module.exports = User;
