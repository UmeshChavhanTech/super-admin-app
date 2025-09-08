const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// ✅ Database status check
router.get('/db-status', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'ok',
      message: 'Database connected successfully!',
      environment: process.env.NODE_ENV || 'not set',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
});

// ✅ Server status check
router.get('/server-status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running fine 🚀',
    environment: process.env.NODE_ENV || 'not set',
    uptime: process.uptime(), // in seconds
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
