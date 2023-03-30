const User = require('../models/user');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name ||!email ||!password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  };
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  };

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: 'User already exists' });
  };

  // Create new user
  const newUser = new User({
    name,
    email,
    password
  });

  if (user) {
    const { _id, name, email, password, photo, phone, bio } = user;
    return res.status(201).json({
      _id, name, email, password, photo, phone, bio
    })
  } else {
    return res.status(400).json({ error: 'Invalid user data' });
  }
  

}



module.exports = registerUser;