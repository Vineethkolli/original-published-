const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    amountGiven: { type: Number, required: true },
    mode: { type: String, required: true, default: 'cash' },
    purpose: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    amountSpent: [{ amount: Number, purpose: String, billSnapshot: Object }],
    amountReturned: { type: Number },
});

module.exports = mongoose.model('Expense', expenseSchema);
