const Post = require('../models/postModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;


const createPost = async (req, res) => {
  try {
    const { title, category, desc } = req.body;

    // Validation
    if (!title || !category || !desc) {
      return res.status(400).json({ error: 'Please fill all fields'});
    }

    // Hadle Image Upload
    let fileData = {}
    if (req.file) {
      // Save image to cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Blog App", resource_type: "image"});

      } catch (error) {
        return res.status(500).json({ error: 'Image could not be uploaded' });
      };

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      }
    }

    // Create Post
    const post = await Post.create({
      user: req.user.id,
      title,
      category,
      desc,
      image: fileData
    });

    return res.status(201).json(post);


  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({user: req.user.id}).sort("-createdAt");
    return res.status(200).json(posts);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Single Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // if (post.user.toString() !== req.user.id) {
    //   return res.status(401).json("User not authorized");
    // }

    return res.status(200).json(post);
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Deleted successfully' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update Post
const updatePost = async (req, res) => {
  try {
    const {title, category, desc } = req.body;
    const { id } = req.params

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
      // Save image to cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Blog App", resource_type: "image"});

      } catch (error) {
        return res.status(500).json({ error: 'Image could not be uploaded' });
      };

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      }
    }
  
    // Update Post
    const updatedPost = await Post.findByIdAndUpdate(
      {_id: id},
      {
        title,
        category,
        desc,
        image: Object.keys(fileData).length === 0 ? post?.image : fileData,
      },
      {
        new: true,
        runValidators: true
      }
    )

    return res.status(200).json(updatedPost);
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}






module.exports = { createPost, getPosts, getPost, deletePost, updatePost };