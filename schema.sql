-- Doa Period Tracker — Database Schema
-- Run: psql -U postgres -f schema.sql

CREATE DATABASE IF NOT EXISTS period_tracker;
\c period_tracker;

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  dob        DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cycles (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date   DATE,
  notes      TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Demo data
INSERT INTO users (name, email, dob) VALUES
  ('Megha',  'megha@example.com',  '1995-03-15'),
  ('Suniti', 'suniti@example.com', '1998-07-22')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cycles (user_id, start_date, end_date)
SELECT u.id, c.start_date::DATE, c.end_date::DATE
FROM (VALUES
  ('megha@example.com',  '2026-01-05', '2026-01-09'),
  ('megha@example.com',  '2026-02-02', '2026-02-06'),
  ('megha@example.com',  '2026-03-02', '2026-03-07'),
  ('megha@example.com',  '2026-04-01', '2026-04-05'),
  ('megha@example.com',  '2026-04-29', '2026-05-03'),
  ('suniti@example.com', '2026-01-10', '2026-01-15'),
  ('suniti@example.com', '2026-02-08', '2026-02-13'),
  ('suniti@example.com', '2026-03-10', '2026-03-14'),
  ('suniti@example.com', '2026-04-07', '2026-04-11'),
  ('suniti@example.com', '2026-05-05', '2026-05-09')
) AS c(email, start_date, end_date)
JOIN users u ON u.email = c.email;
