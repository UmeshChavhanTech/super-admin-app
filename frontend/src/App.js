// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import Analytics from "./pages/Analytics";
import Navbar from "./components/Navbar";
import "./App.css";

// ✅ Safe JSON parse helper
const safeParse = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    // If parsing fails, clear invalid storage
    localStorage.removeItem("user");
    return null;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = safeParse(localStorage.getItem("user"));

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Navbar user={user} logout={logout} />
            <div className="container">
              <Routes>
                <Route path="/users" element={<Users />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/users" replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login login={login} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
