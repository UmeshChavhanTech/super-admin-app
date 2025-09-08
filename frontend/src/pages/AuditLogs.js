import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AuditLogs.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      }).toString();

      const response = await api.get(`/superadmin/audit-logs?${params}`);
      setLogs(response.data.auditLogs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      userId: '',
      action: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) return <div>Loading audit logs...</div>;

  return (
    <div className="audit-logs-container">
      <h2>Audit Logs</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => handleFilterChange('userId', e.target.value)}
        />
        <input
          type="text"
          placeholder="Action"
          value={filters.action}
          onChange={(e) => handleFilterChange('action', e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="audit-logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Action</th>
            <th>Actor</th>
            <th>Target Type</th>
            <th>Target ID</th>
            <th>Timestamp</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.action}</td>
              <td>{log.actor?.name} ({log.actor?.email})</td>
              <td>{log.targetType}</td>
              <td>{log.targetId || 'N/A'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                {log.details ? JSON.stringify(log.details) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;