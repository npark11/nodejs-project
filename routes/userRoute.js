const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/userController');
const protect = require('../middleWare/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', protect, getUser);



module.exports = router;