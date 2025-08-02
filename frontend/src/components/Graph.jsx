// src/components/Graph.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getExpensesByCategory, getExpensesByDate } from '../api/transactions';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Graph = ({ refreshTrigger }) => {
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  console.log('Category Data:', categoryData);
  const [dateData, setDateData] = useState({ labels: [], datasets: [] });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const params = {
      startDate: startDate ? startDate.toISOString().slice(0, 10) : null,
      endDate: endDate ? endDate.toISOString().slice(0, 10) : null,
    };

    try {
      const [categoryRes, dateRes] = await Promise.all([
        getExpensesByCategory(params),
        getExpensesByDate(params),
      ]);

      // Prepare Category data for Pie chart
      setCategoryData({
        labels: categoryRes.data.map(item => item._id),
        datasets: [{
          label: 'Expenses by Category',
          data: categoryRes.data.map(item => item.totalAmount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
        }],
      });

      // Prepare Date data for Bar chart
      setDateData({
        labels: dateRes.data.map(item => item._id),
        datasets: [{
          label: 'Daily Expenses',
          data: dateRes.data.map(item => item.totalAmount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, refreshTrigger]);

  return (
    <div className="graphs-container">
      <h3>Expense Analytics</h3>
      <div className="filter-controls">
        <label>Start Date:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" />
        <label>End Date:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" />
      </div>

      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="charts-wrapper">
          <div className="chart">
            <h4>Expenses by Category</h4>
            {categoryData.labels.length > 0 ? (
              <Pie data={categoryData} />
            ) : (
              <p>No expense data for this period.</p>
            )}
          </div>
          <div className="chart">
            <h4>Daily Expenses</h4>
            {dateData.labels.length > 0 ? (
              <Bar data={dateData} />
            ) : (
              <p>No expense data for this period.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Graph;