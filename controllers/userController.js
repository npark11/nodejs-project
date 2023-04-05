const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


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

// Update User Profile
const updateUser = async (req, res) => {
 try {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.name = req.body.name || name;
    user.email = email;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio
    });
  } else {
    return res.status(404).json({ error: 'User does not exist' });
  }

  
 }
 catch (err) {
   return res.status(500).json({ error: err.message });
 }
};

// Update Password
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Check if password is correct
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // Save new password
    if (user && isMatch) {
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email});

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Delete token if it exists in DB
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    // Create reset token
    let resetToken = crypto.randomBytes(32).toString('hex') + user._id;
    
    // Hash token before saving it to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save Token to DB
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 10000)       // 30 minutes
    }).save();
    
    // Construct reset URL
    const resetUrl = `${process.env.FRONT_END}/resetpassword/${resetToken}`;

    // Reset email
    const message = `
     <h2>Hello, ${user.name}</h2>
     <p>Please use the url below to reset your password.</p>
     <p>This reset linke is valid for only 30 minutes.</p>
     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

     <p>Thank you</p>
    `;
    const subject = 'Password Reset Request';
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
      res.status(500).json("Email could not be sent, please try again");
    }

  } catch {
    return res.status(500).json({ error: err.message });
  }
};


module.exports = { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, updatePassword, forgotPassword };