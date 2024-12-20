const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'developer'], default: 'user' },
    registerId: { type: String, unique: true },  // New field for registerId
    otp: { type: String },
    otpExpiration: { type: Date },
});

module.exports = mongoose.model('User', userSchema);