const Income = require('../models/Income');

// Create a new income entry
const createIncomeEntry = async (req, res) => {
    const { name, email, phoneNumber, amount, category, status, paymentMode } = req.body;

    try {
        const newIncome = new Income({ name, email, phoneNumber, amount, category, status, paymentMode });
        await newIncome.save();
        res.status(201).json({ message: 'Income entry created successfully', data: newIncome });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all income entries
const getAllIncomeEntries = async (req, res) => {
    try {
        const incomeEntries = await Income.find();
        res.status(200).json(incomeEntries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch income entries', error: error.message });
    }
};

module.exports = { createIncomeEntry, getAllIncomeEntries };
