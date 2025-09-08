import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await api.post('/test', { test: 'connection' });
      console.log('Backend connection test successful:', response.data);
      return true;
    } catch (err) {
      console.error('Backend connection test failed:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, password });
      
      // First test if backend is reachable
      const isBackendConnected = await testBackendConnection();
      if (!isBackendConnected) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
        setLoading(false);
        return;
      }

      // Now try actual login
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      navigate('/users');
    } catch (err) {
      console.error('Login error details:', err);
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.status === 500) {
          setError('Server error. Please check backend console for details.');
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        // Something else happened
        setError('An unexpected error occurred: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Super Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="superadmin@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Test1234!"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="demo-credentials">
          <p>Demo credentials:</p>
          <p>Email: superadmin@example.com</p>
          <p>Password: Test1234!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;