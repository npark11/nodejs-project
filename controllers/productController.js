const Product = require('../models/productModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;


const createProduct = async (req, res) => {
  try {
    const {name, sku, category, quantity, price, description } = req.body;
    console.log(req.body);
    // Validation
    if (!name || !category || !quantity || !price || !description) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
      // Save image to cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "newPinvent App", resource_type: "image"});

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

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({user: req.user.id}).sort("-createdAt");
    return res.status(200).json(products);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Single Product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json("Product not found");
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json("User not authorized");
    }

    return res.status(200).json(product);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    product = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Deleted successfully' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update Product
const updateProduct = async (req, res) => {
  try {
    const {name, category, quantity, price, description } = req.body;
    const { id } = req.params

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
      // Save image to cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "newPinvent App", resource_type: "image"});

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
  
    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
      {_id: id},
      {
        name,
        category,
        quantity,
        price,
        description,
        image: Object.keys(fileData).length === 0 ? product?.image : fileData,
      },
      {
        new: true,
        runValidators: true
      }
    )

    return res.status(200).json(updatedProduct);
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



module.exports = { createProduct, getProducts, getProduct, deleteProduct, updateProduct };