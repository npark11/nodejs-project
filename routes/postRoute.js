const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, deletePost, updatePost } = require('../controllers/postController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.delete('/:id', protect, deletePost);
router.patch('/:id', protect, upload.single("image"), updatePost);


module.exports = router;