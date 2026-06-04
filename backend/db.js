const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  host:     process.env.DB_HOST     || 'postgres.railway.internal',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'railway',
  // user:     process.env.DB_USER     || 'postgres',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'GwZryKOPrAuDfyXdKplzbeLndkcaDoKs',
});

module.exports = db;
