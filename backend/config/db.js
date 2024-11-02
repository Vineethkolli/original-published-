const mongoose = require('mongoose');

// Connection to default database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Connection to Income Data database
const connectIncomeDB = async () => {
    try {
        await mongoose.createConnection(process.env.MONGO_INCOME_URI);
        console.log('MongoDB (Income DB) connected');
    } catch (error) {
        console.error('MongoDB connection error (Income DB):', error.message);
        process.exit(1);
    }
};

// Connection to Expense Data database
const connectExpenseDB = async () => {
    try {
        await mongoose.createConnection(process.env.MONGO_EXPENSE_URI);
        console.log('MongoDB (Expense DB) connected');
    } catch (error) {
        console.error('MongoDB connection error (Income DB):', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, connectIncomeDB, connectExpenseDB };
