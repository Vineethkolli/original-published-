const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure unique names
    },
    email: {
        type: String,
        required: false,
        default: null,
    },
    phoneNumber: {
        type: String,
        required: false,
        default: null,
        // No unique constraint on phoneNumber
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        required: false,
        default: 'cash',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Income', incomeSchema);
