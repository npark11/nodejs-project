const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, "Please enter a title"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    trim: true
  },
  desc: {
    type: String,
    required: [true, "Please add a description"],
    trim: true
  },
  image: {
    type: Object,
    default: {}
  },
}, {
  timestamps: true,
});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;