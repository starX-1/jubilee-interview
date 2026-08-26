const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jubilee_jwt_secret_2026';
const OFFICER_USERNAME = process.env.OFFICER_USERNAME || 'officer@jubilee.com';
const OFFICER_PASSWORD = process.env.OFFICER_PASSWORD || 'Jubilee2026!';

if (!DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL environment variable is missing in backend/.env');
  process.exit(1);
}

module.exports = {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  OFFICER_USERNAME,
  OFFICER_PASSWORD
};
