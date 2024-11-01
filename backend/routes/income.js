const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const {signin} = require('../controllers/authController');
// Route to create a new income entry
router.post('/create', async (req, res) => {
  const { name, email, phoneNumber, amount, category, status, paymentMode, timestamp } = req.body;

  try {
    const newIncomeEntry = new Income({
      name,
      email,
      phoneNumber,
      amount,
      category,
      status,
      paymentMode,
      date: timestamp, // Use the timestamp provided
    });

    await newIncomeEntry.save();
    res.status(201).json({ message: 'Income entry created successfully', newIncomeEntry });
  } catch (error) {
    console.error('Error creating income entry:', error);
    res.status(500).json({ message: 'Error creating income entry' });
  }
});

module.exports = router;
