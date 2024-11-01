const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, connectIncomeDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const incomeRoutes = require('./routes/income');
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();
connectIncomeDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

app.use(cors({
    origin: ["https://nbkyouth.vercel.app"], // Replace with your actual frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}));

// API routes
app.use('/api/auth', authRoutes);

// Income entry routes
app.use('/api/income', incomeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));