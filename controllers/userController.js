const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
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

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: false
    });
    

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

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email ||!password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    } 

    // Check if user exits
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist, please sign up' });
    }

    // User exists, check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    if (isMatch) {
      res.cookie("token", token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: false
      });
    };
    

    if (user && isMatch) {
      const { _id, name, email, photo, phone, bio } = user;
      return res.status(200).json({
        _id, name, email, photo, phone, bio, token
      });
      
    } else {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

// User Profile - get user information
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      return res.status(200).json({
        _id, name, email, photo, phone, bio
      });
    } else {
      return res.status(400).json({ error: 'User does not exist' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get login status
const loginStatus = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

};


module.exports = { registerUser, loginUser, logoutUser, getUser, loginStatus };