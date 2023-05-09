const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, deleteProduct } = require('../controllers/productController');
const protect = require('../middleWare/auth');
const { upload } = require('../utils/fileUpload');


router.post('/', protect, upload.single("image"), createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.delete('/:id', protect, deleteProduct);


module.exports = router;