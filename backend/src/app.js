const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const claimRoutes = require('./routes/claimRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Route
app.get('/api/health', async (req, res, next) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'UP',
      service: 'Jubilee Insurance Claims Tracker API',
      database: 'Connected (Neon PostgreSQL)',
      dbTime: result.rows[0].now
    });
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

// Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
