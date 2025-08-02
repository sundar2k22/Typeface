// src/api/transactions.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/transactions';

export const createTransaction = (transactionData) => {
  return axios.post(API_URL, transactionData);
};

export const getTransactions = (params) => {
  return axios.get(API_URL, { params });
};

export const getExpensesByCategory = (params) => {
  return axios.get(`${API_URL}/summary/category`, { params });
};

export const getExpensesByDate = (params) => {
  return axios.get(`${API_URL}/summary/date`, { params });
};