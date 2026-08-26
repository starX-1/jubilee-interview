const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL environment variable is missing in backend/.env');
  process.exit(1);
}

module.exports = {
  PORT,
  DATABASE_URL
};
