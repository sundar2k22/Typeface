// backend/controllers/transactionController.js
const Transaction = require('../models/Transactions');

// @desc    Create a new transaction (income/expense)
// @route   POST /api/transactions
// @access  Public (for now, would be Private with auth)
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    // Basic validation
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Please include all required fields: type, amount, category' });
    }

    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
    }

    const transaction = await Transaction.create({
      // user: req.user.id, // Uncomment when user authentication is implemented
      type,
      amount: Number(amount), // Ensure amount is a number
      category,
      description,
      date: date ? new Date(date) : Date.now(), // Use provided date or default to now
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all transactions within a time range
// @route   GET /api/transactions
// @access  Public (for now)
// @query   startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), type (income/expense)
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query = {};

    // Add date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // To include the whole end day, set end date to end of day
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // Go to next day
        end.setHours(0, 0, 0, 0); // Set to start of next day
        query.date.$lt = end; // Less than start of next day
      }
    }

    // Add type filter (income/expense)
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    // Sort by date descending (latest first)
    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get expenses summarized by category for graphing
// @route   GET /api/transactions/summary/category
// @access  Public (for now)
// @query   startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
const getExpensesByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchQuery = { type: 'expense' };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) {
        matchQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        matchQuery.date.$lt = end;
      }
    }

    const result = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get expenses summarized by date for graphing (e.g., daily totals)
// @route   GET /api/transactions/summary/date
// @access  Public (for now)
// @query   startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
const getExpensesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchQuery = { type: 'expense' };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) {
        matchQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        matchQuery.date.$lt = end;
      }
    }

    const result = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getExpensesByCategory,
  getExpensesByDate,
};