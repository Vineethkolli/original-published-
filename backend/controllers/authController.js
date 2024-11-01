const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailjet = require('node-mailjet');
const User = require('../models/User');

const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY, 
    process.env.MAILJET_API_SECRET
);

// Signup
const signup = async (req, res) => {
    const { name, email, phoneNumber, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'user';
        const user = new User({ name, email, phoneNumber, password: hashedPassword, role: userRole });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Signin
const signin = async (req, res) => {
    const { emailOrPhone, password, role } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.role !== role) {
            return res.status(403).json({ message: 'Unauthorized: Role mismatch' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Forget Password
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiration = Date.now() + 600000; // OTP valid for 10 minutes
        await user.save();

        // Sending OTP via Mailjet
        const request = mailjetClient.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL,
                        Name: 'NBK Youth'
                    },
                    To: [
                        {
                            Email: email,
                            Name: user.name || 'User'
                        }
                    ],
                    Subject: 'Your OTP for Password Reset',
                    TextPart: `Your OTP is ${otp}. It is valid for 10 minutes.`,
                    HTMLPart: `<h3>Your OTP is <strong>${otp}</strong>.It is valid for 10 minutes.</h3>`,
                }
            ]
        });
        await request; // Ensure this line completes successfully
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in forget-password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || Date.now() > user.otpExpiration) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (for developers only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Update user role (for developers only)
const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Role updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update role' });
    }
};

module.exports = {signup, signin, forgetPassword, resetPassword, getUsers, updateUserRole};