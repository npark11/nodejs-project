const Product = require('../models/productModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
fileSizeFormatter


const createProduct = async (req, res) => {
  try {
    const {name, sku, category, quantity, price, description } = req.body;

    // Validation
    if (!name || !category || !quantity || !price || !description) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
      fileData = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      }
    }
  
    // Create Product
    const product = await Product.create({
      user: req.user.id,
      name,
      sku,
      category,
      quantity,
      price,
      description,
      image: fileData
    });

    return res.status(201).json(product);


  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

};



module.exports = { createProduct };