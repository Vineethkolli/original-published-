const express = require('express');
const router = express.Router();
const {
    createExpenseEntry,
    getAllExpenseEntries,
    searchExpenseEntries,
    updateExpenseEntry,
    deleteExpenseEntry
} = require('../controllers/expenseController');

// Route to create a new expense entry
router.post('/create', createExpenseEntry);

// Route to get all expense entries
router.get('/', getAllExpenseEntries);

// Route to search expense entries by name or phone number
router.get('/search', searchExpenseEntries);

// Route to update an expense entry by ID
router.post('/update/:id', updateExpenseEntry);

// Route to delete an expense entry by ID
router.delete('/delete/:id', deleteExpenseEntry);

module.exports = router;
