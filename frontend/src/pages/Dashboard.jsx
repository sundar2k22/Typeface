// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Graph from '../components/Graph';
import { createTransaction } from '../api/transactions';

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionCreated = async (newTransaction) => {
    try {
      await createTransaction(newTransaction);
      // Increment state to trigger a re-fetch in child components
      setRefreshTrigger(prev => prev + 1);
      alert('Transaction added successfully!');
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Failed to add transaction.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Personal Finance Tracker</h1>
      <div className="main-content">
        <div className="sidebar">
          <TransactionForm onTransactionCreated={handleTransactionCreated} />
        </div>
        <div className="content">
          <TransactionList refreshTrigger={refreshTrigger} />
          <Graph refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;