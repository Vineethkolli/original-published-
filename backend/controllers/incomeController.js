const Income = require('../models/Income');

// Create a new income entry
const createIncomeEntry = async (req, res) => {
    const { name, email, phoneNumber, amount, category, status, paymentMode } = req.body;

    // Validate required fields
    if (!name || !amount || !category || !status) {
        return res.status(400).json({ message: 'Name, amount, category, and status are required.' });
    }

    try {
        // Check for existing entries with the same name
        const existingEntry = await Income.findOne({ name });

        if (existingEntry) {
            return res.status(400).json({ message: 'Name already exists.' });
        }

        // Create new entry
        const incomeEntry = new Income({
            name,
            email: email || null,         // Set to null if not provided
            phoneNumber: phoneNumber || null, // Set to null if not provided
            amount,
            category,
            status,
            paymentMode: paymentMode || 'cash', // Default to 'cash' if not provided
            timestamp: new Date(),
        });

        await incomeEntry.save();
        res.status(201).json(incomeEntry);
    } catch (error) {
        console.error('Error creating income entry:', error);
        res.status(500).json({ message: 'Error creating income entry.' });
    }
};

// Update an existing income entry
const updateIncomeEntry = async (req, res) => {
    const { id } = req.params;
    const { amount, category, status, paymentMode } = req.body;

    try {
        const incomeEntry = await Income.findById(id);
        if (!incomeEntry) {
            return res.status(404).json({ message: 'Income entry not found.' });
        }

        // Update fields if they are provided
        incomeEntry.amount = amount !== undefined ? amount : incomeEntry.amount;
        incomeEntry.category = category !== undefined ? category : incomeEntry.category;
        incomeEntry.status = status !== undefined ? status : incomeEntry.status;
        incomeEntry.paymentMode = paymentMode !== undefined ? paymentMode : incomeEntry.paymentMode;

        // Note: The name remains unchanged
        await incomeEntry.save();
        res.json(incomeEntry);
    } catch (error) {
        console.error('Error updating income entry:', error);
        res.status(500).json({ message: 'Error updating income entry.' });
    }
};

// Search for income entries
const searchIncomeEntries = async (req, res) => {
    const { name, phoneNumber } = req.query;

    try {
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (phoneNumber) {
            query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
        }

        const results = await Income.find(query);
        res.json(results);
    } catch (error) {
        console.error('Error searching income entries:', error);
        res.status(500).json({ message: 'Error searching income entries.' });
    }
};

// Get all income entries
const getAllIncomeEntries = async (req, res) => {
    try {
        const incomeEntries = await Income.find();
        res.json(incomeEntries);
    } catch (error) {
        console.error('Error fetching income entries:', error);
        res.status(500).json({ message: 'Error fetching income entries.' });
    }
};

module.exports = {
    createIncomeEntry,
    getAllIncomeEntries,
    updateIncomeEntry,
    searchIncomeEntries,
};
