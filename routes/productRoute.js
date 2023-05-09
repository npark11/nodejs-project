const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct } = require('../controllers/productController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);


module.exports = router;