const mongoose = require('mongoose');

// Connection to the auth database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'auth' // Specify the database name
        });
        console.log('MongoDB connected to auth database');
    } catch (error) {
        console.error('MongoDB connection error (auth):', error.message);
        process.exit(1);
    }
};

// Connection to the income database
const connectIncomeDB = async () => {
    try {
        await mongoose.createConnection(process.env.MONGO_INCOME_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'income' // Specify the database name
        });
        console.log('MongoDB connected to income database');
    } catch (error) {
        console.error('MongoDB connection error (income):', error.message);
        process.exit(1);
    }
};

// Connection to the expense database
const connectExpenseDB = async () => {
    try {
        await mongoose.createConnection(process.env.MONGO_EXPENSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'expense' // Specify the database name
        });
        console.log('MongoDB connected to expense database');
    } catch (error) {
        console.error('MongoDB connection error (expense):', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, connectIncomeDB, connectExpenseDB };
