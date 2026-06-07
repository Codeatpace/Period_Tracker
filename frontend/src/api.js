// All API calls — proxy strips /api prefix in dev via vite.config.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const req = (path, opts) =>
  fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts }).then(r => r.json())

export const getQuote   = ()           => req('/api/users/quote')
export const getUsers   = ()           => req('/api/users')
export const createUser = body         => req('/api/users', { method: 'POST', body: JSON.stringify(body) })
export const signIn     = body         => req('/api/users/signin', { method: 'POST', body: JSON.stringify(body) })
export const getCycles  = userId       => req(`/api/cycles/${userId}`)
export const logPeriod  = body         => req('/api/cycles', { method: 'POST', body: JSON.stringify(body) })
export const endPeriod  = (id, date)   => req(`/api/cycles/${id}/end`, { method: 'PUT', body: JSON.stringify({ end_date: date }) })
export const getPrediction = userId    => req(`/api/cycles/predict/${userId}`)
