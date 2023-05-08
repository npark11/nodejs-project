const Product = require('../models/productModel');


const createProduct = async (req, res) => {
  try {
    const {name, sku, category, quantity, price, description } = req.body;

    // Validation
    if (!name || !category || !quantity || !price || !description) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    // Manage Image upload

  
    // Create Product
    const product = await Product.create({
      user: req.user.id,
      name,
      sku,
      category,
      quantity,
      price,
      description,
    });

    return res.status(201).json(product);


  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

};



module.exports = { createProduct };