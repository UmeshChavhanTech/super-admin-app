require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superadmin');
const debugRoutes = require('./routes/debug');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ====================== ROUTES ======================

// Test endpoint (works with GET + POST)
app.get('/api/v1/test', (req, res) => {
  res.json({
    message: 'Backend is working with GET!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/v1/test', (req, res) => {
  console.log('Test endpoint called with:', req.body);
  res.json({
    message: 'Backend is working with POST!',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// API base route
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to API v1 🚀',
    availableEndpoints: [
      '/api/v1/test',
      '/api/v1/auth',
      '/api/v1/superadmin',
      '/api/v1/debug/db-status',
      '/api/v1/debug/server-status'
    ]
  });
});

// Other Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin', superAdminRoutes);
app.use('/api/v1/debug', debugRoutes);

// ====================== ERROR HANDLERS ======================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// ====================== START SERVER ======================
const startServer = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync database models (safe approach)
    console.log('Syncing database models...');
    
    const syncOptions = {
      force: false,
      alter: false, // Disable automatic table alterations
    };

    try {
      await sequelize.sync(syncOptions);
      console.log('✅ Database synced successfully (no alterations)');
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('ℹ️  Database already in sync, continuing without alterations...');
      } else {
        console.error('❌ Database sync error:', error.message);
        console.log('⚠️  Starting server with existing database structure...');
      }
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log(`✅ Test endpoint (GET): http://localhost:${PORT}/api/v1/test`);
      console.log(`✅ Test endpoint (POST): http://localhost:${PORT}/api/v1/test`);
      console.log(`✅ API base: http://localhost:${PORT}/api/v1`);
      console.log(`✅ Debug DB status: http://localhost:${PORT}/api/v1/debug/db-status`);
      console.log(`✅ Debug Server status: http://localhost:${PORT}/api/v1/debug/server-status`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();