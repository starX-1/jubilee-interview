const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('./db');
const claimsRouter = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'UP',
      service: 'Jubilee Insurance Claims Tracker API',
      database: 'Connected (Neon PostgreSQL)',
      dbTime: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message
    });
  }
});

// API Routes
app.use('/api/claims', claimsRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred.'
  });
});

// Start Server & Initialize Database
async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Jubilee Insurance Claims API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Claims API: http://localhost:${PORT}/api/claims`);
    
    try {
      console.log('Verifying Neon PostgreSQL database connection...');
      await db.initDb();
      console.log('Database ready for requests.');
    } catch (error) {
      console.error('Database connection warning:', error.message);
    }
  });
}

startServer();
