// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    // In a real app, you'd link this to a User model
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
    type: {
      type: String,
      required: [true, 'Please select a transaction type (income/expense)'],
      enum: ['income', 'expense'], // Restrict to 'income' or 'expense'
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      // You might want to define a list of allowed categories for better consistency
      // enum: ['Food', 'Salary', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Groceries', 'Bills', 'Shopping', 'Investment', 'Other']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description can be at most 200 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Please select a date for the transaction'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);