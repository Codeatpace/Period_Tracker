const db = require('../db');
const { computePrediction } = require('../services/predictionService');

async function getCycles(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cycles WHERE user_id = $1 ORDER BY start_date DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function logPeriod(req, res) {
  const { user_id, start_date, notes } = req.body;
  if (!user_id || !start_date) return res.status(400).json({ error: 'user_id and start_date required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO cycles (user_id, start_date, notes) VALUES ($1, $2, $3) RETURNING *',
      [user_id, start_date, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function endPeriod(req, res) {
  const { end_date } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE cycles SET end_date = $1 WHERE id = $2 RETURNING *',
      [end_date, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Cycle not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function predict(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT * FROM cycles WHERE user_id = $1 ORDER BY start_date',
      [req.params.userId]
    );
    const prediction = computePrediction(rows);
    res.json(prediction ?? { message: 'Log at least one cycle to see predictions.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getCycles, logPeriod, endPeriod, predict };
