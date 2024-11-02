const express = require('express');
const router = express.Router();
const {
    createIncomeEntry,
    getAllIncomeEntries,
    searchIncomeEntries,
    updateIncomeEntry,
    deleteIncomeEntry
} = require('../controllers/incomeController');

// Route to create a new income entry
router.post('/create', createIncomeEntry);

// Route to get all income entries
router.get('/', getAllIncomeEntries);

// Route to search income entries by name or phone number
router.get('/search', searchIncomeEntries);

// Route to update an income entry by ID
router.post('/update/:id', updateIncomeEntry); // Change to PUT for updating

// Route to delete an income entry by ID
router.delete('/delete/:id', deleteIncomeEntry); // Route to delete income entry

module.exports = router;
