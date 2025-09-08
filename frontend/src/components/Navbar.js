import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, logout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Super Admin Panel</h2>
      </div>
      
      <div className="navbar-menu">
        <Link 
          to="/users" 
          className={location.pathname === '/users' ? 'active' : ''}
        >
          Users
        </Link>
        <Link 
          to="/audit-logs" 
          className={location.pathname === '/audit-logs' ? 'active' : ''}
        >
          Audit Logs
        </Link>
        <Link 
          to="/analytics" 
          className={location.pathname === '/analytics' ? 'active' : ''}
        >
          Analytics
        </Link>
      </div>
      
      <div className="navbar-user">
        <span>Welcome, {user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;