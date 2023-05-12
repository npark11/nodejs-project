const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, deletePost } = require('../controllers/postController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createPost);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);
router.delete('/:id', protect, deletePost);


module.exports = router;