const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');
const protect = require('../middleWare/auth');


router.post('/', protect, createProduct);


module.exports = router;