require('dotenv').config();
const express = require('express');
const { signup, signin, forgetPassword, resetPassword, getUsers, updateUserRole} = require('../controllers/authController');
const { verifyDeveloperRole } = require('../middleware/auth');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Signin route
router.post('/signin', signin);

// Forget Password
router.post('/forget-password', forgetPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Get all users (for developers only)
router.get('/get-users', verifyDeveloperRole, getUsers);

// Update user role (for developers only)
router.patch('/update-role/:userId', verifyDeveloperRole, updateUserRole);

module.exports = router;
