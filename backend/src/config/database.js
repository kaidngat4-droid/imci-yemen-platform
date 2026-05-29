const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'imci_db',
  user: process.env.DB_USER || 'imci_user',
  password: process.env.DB_PASS || 'imci_2026_secure',
});

pool.on('error', (err) => {
  console.error('❌ Database Error:', err.message);
});

module.exports = pool;
