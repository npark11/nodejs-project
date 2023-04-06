const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, updatePassword, forgotPassword, resetPassword } = require('../controllers/userController');
const protect = require('../middleWare/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', protect, getUser);
router.get('/loggedin', loginStatus);
router.patch('/updateprofile', protect, updateUser);
router.patch('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);



module.exports = router;