const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createPost);
router.get('/', protect, getPosts);


module.exports = router;