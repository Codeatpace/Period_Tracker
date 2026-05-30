const db = require('../db');
const { randomQuote } = require('../services/predictionService');

async function getUsers(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM users ORDER BY name');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createUser(req, res) {
  const { name, email, dob } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO users (name, email, dob) VALUES ($1, $2, $3) RETURNING *',
      [name, email, dob || null]
    );
    res.status(201).json({ user: rows[0], quote: randomQuote() });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getUsers, createUser };
