import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/superadmin/analytics/summary');
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="stat">{summary.totalUsers}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Roles</h3>
          <p className="stat">{summary.totalRoles}</p>
        </div>
        
        <div className="summary-card">
          <h3>Recent Logins (7 days)</h3>
          <p className="stat">{summary.recentLogins}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;