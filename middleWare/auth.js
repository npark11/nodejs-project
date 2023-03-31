const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Get user id from token
    const user = await User.findById(verified.id).select('-password');
    if (!user) {
      return res.status(401).json("User not found");
    }

    req.user = user;
    next();

  } catch (error) {

  }
};


module.exports = protect;