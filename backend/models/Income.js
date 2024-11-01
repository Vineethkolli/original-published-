const mongoose = require('mongoose');

// Define schema for income entry
const incomeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['villagers', 'youth'], required: true },
    status: { type: String, enum: ['paid', 'Not paid'], required: true },
    paymentMode: { type: String, enum: ['cash', 'online', 'app'], default: 'cash' },
    date: { type: Date, default: Date.now }
});

// Export Income model
module.exports = mongoose.model('Income', incomeSchema);
