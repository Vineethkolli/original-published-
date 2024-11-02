const Expense = require('../models/expense');

// Create a new expense entry
exports.createExpenseEntry = async (req, res) => {
    try {
        const { name, phoneNumber, amountGiven, mode, purpose, amountSpent, amountReturned } = req.body;

        const expenseEntry = new Expense({
            name,
            phoneNumber,
            amountGiven,
            mode,
            purpose,
            amountSpent,
            amountReturned
        });

        await expenseEntry.save();
        return res.status(201).json({ message: 'Expense entry created successfully!', expenseEntry });
    } catch (error) {
        console.error('Error creating expense entry:', error);
        return res.status(500).json({ message: 'Error creating expense entry. Please try again later.' });
    }
};

// Get all expense entries
exports.getAllExpenseEntries = async (req, res) => {
    try {
        const expenses = await Expense.find();
        return res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return res.status(500).json({ message: 'Error fetching expenses. Please try again later.' });
    }
};

// Search expense entries by name or phone number
exports.searchExpenseEntries = async (req, res) => {
    const { name, phoneNumber } = req.query;

    try {
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };  // Case-insensitive partial match
        }
        if (phoneNumber) {
            query.phoneNumber = { $regex: phoneNumber, $options: 'i' };  // Case-insensitive partial match
        }

        const expenses = await Expense.find(query);
        return res.status(200).json(expenses);
    } catch (error) {
        console.error('Error searching expenses:', error);
        return res.status(500).json({ message: 'Error searching expenses. Please try again later.' });
    }
};

// Update an expense entry by ID
exports.updateExpenseEntry = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense entry not found.' });
        }

        return res.status(200).json({ message: 'Expense entry updated successfully!', updatedExpense });
    } catch (error) {
        console.error('Error updating expense entry:', error);
        return res.status(500).json({ message: 'Error updating expense entry. Please try again later.' });
    }
};

// Delete an expense entry by ID
exports.deleteExpenseEntry = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense entry not found.' });
        }

        return res.status(200).json({ message: 'Expense entry deleted successfully!', deletedExpense });
    } catch (error) {
        console.error('Error deleting expense entry:', error);
        return res.status(500).json({ message: 'Error deleting expense entry. Please try again later.' });
    }
};
