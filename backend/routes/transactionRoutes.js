// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getExpensesByCategory,
  getExpensesByDate,
} = require('../controllers/transactionController');

// Route for creating a new transaction (income/expense)
router.post('/', createTransaction);

// Route for listing all transactions (with optional date range and type filters)
router.get('/', getTransactions);

// Route for getting expenses summarized by category for charts
router.get('/summary/category', getExpensesByCategory);

// Route for getting expenses summarized by date for charts
router.get('/summary/date', getExpensesByDate);

module.exports = router;