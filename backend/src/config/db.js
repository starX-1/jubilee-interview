const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL pool client:', err);
});

/**
 * Initializes database schema on startup
 */
async function initDb() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(sql);
    console.log('PostgreSQL database schema verified & initialized successfully (Neon DB).');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDb
};
