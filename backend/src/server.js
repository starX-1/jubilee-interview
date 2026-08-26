const app = require('./app');
const { PORT } = require('./config/env');
const { initDb } = require('./config/db');

async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Jubilee Insurance Claims API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Claims API: http://localhost:${PORT}/api/claims`);

    try {
      console.log('Verifying Neon PostgreSQL database connection...');
      await initDb();
      console.log('Database ready for requests.');
    } catch (error) {
      console.error('Database connection warning:', error.message);
    }
  });
}

startServer();
