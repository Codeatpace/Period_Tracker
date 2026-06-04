const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'period_tracker',
  // user:     process.env.DB_USER     || 'postgres',
  user:     process.env.DB_USER     || 'tech.Joshfuels',
  password: process.env.DB_PASSWORD || '',
});

module.exports = db;
