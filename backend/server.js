const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, connectIncomeDB, connectExpenseDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense'); 

dotenv.config();
connectDB();         // Connect to the default MongoDB
connectIncomeDB();    // Connect to the Income MongoDB
connectExpenseDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(cors({
    origin: ["https://nbkyouth.vercel.app"], // Replace with your actual frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}));

// Authentication routes
app.use('/api/auth', authRoutes);

// Income entry routes
app.use('/api/income', incomeRoutes);

// Expense entry routes
app.use('/api/expense', expenseRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
