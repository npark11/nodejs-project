const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password must be up to 8 characters"],
    maxLength: [23, "Password must not be more than 23 characters"]
  },
  photo: {
    type: String,
    required: [true, "Please upload a photo"],
    default: "https://picsum.photos/id/660/300"
  },
  phone: {
    type: String,
    default: "+1"
  },
  bio: {
    type: String,
    maxLength: [250, "Bio must not be more than 250 characters"],
    default: "bio"
  }
}, {
  timestamps: true
});



const User = mongoose.model("User", userSchema);
module.exports = User;