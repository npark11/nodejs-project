const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost } = require('../controllers/postController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createPost);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);


module.exports = router;