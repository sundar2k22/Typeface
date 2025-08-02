// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // For handling CORS policies
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config(); // Load environment variables
connectDB(); // Connect to database

const app = express();


app.use(cors()); // Use the configured CORS middleware

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body

// Define API routes
app.use('/api/transactions', transactionRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('Personal Finance Assistant API is running!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
