const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name ||!email ||!password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    };
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    };

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    };

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate Token
    const token = generateToken(user._id);

    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      return res.status(201).json({
        _id, name, email, photo, phone, bio, token
      })
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }

}



module.exports = { registerUser };