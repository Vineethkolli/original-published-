const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: false, default: null},
    phoneNumber: {type: String, required: false, default: null},
    amount: {type: Number, required: true},
    category: { type: String, required: true},
    status: { type: String, required: true},
    paymentMode: {type: String, required: false, default: 'cash'},
    timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Income', incomeSchema);
