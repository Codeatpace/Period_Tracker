import { useState, useEffect, useCallback } from 'react'
import { getQuote, getCycles, logPeriod, endPeriod, getPrediction } from '../api'

const fmt = val => {
  if (!val) return '—'
  const d = new Date(val)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysLabel(dateStr) {
  if (!dateStr) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((target - today) / 86400000)
  if (diff < 0)  return `${Math.abs(diff)}d ago`
  if (diff === 0) return 'Today!'
  return `in ${diff} days`
}

function PredCard({ icon, label, main, sub, accent }) {
  return (
    <div className="card" style={{ padding: '16px 18px', borderTop: `3px solid ${accent}` }}>
      <p style={{ fontSize: 12, color: '#b09ac2', marginBottom: 7 }}>{icon} {label}</p>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#3d2b4e', lineHeight: 1.3 }}>{main}</p>
      {sub && <p style={{ fontSize: 11, color: accent, marginTop: 3, fontWeight: 500 }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard({ user, onLogout }) {
  const [quote, setQuote]           = useState('')
  const [cycles, setCycles]         = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [logDate, setLogDate]       = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  const [showLogForm, setShowLogForm] = useState(false)

  const activeCycle = cycles.find(c => !c.end_date)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [c, p] = await Promise.all([getCycles(user.id), getPrediction(user.id)])
    setCycles(Array.isArray(c) ? c : [])
    setPrediction(p?.nextPeriodStart ? p : null)
    setLoading(false)
  }, [user.id])

  useEffect(() => {
    getQuote().then(d => setQuote(d.quote)).catch(() => {})
    loadData()
  }, [loadData])

  async function handleLogStart() {
    await logPeriod({ user_id: user.id, start_date: logDate })
    setShowLogForm(false)
    loadData()
  }

  async function handleLogEnd() {
    const today = new Date().toISOString().split('T')[0]
    await endPeriod(activeCycle.id, today)
    loadData()
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/Lutia.png" alt="Lutia" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#d63384', letterSpacing: '-0.5px' }}>Lutia</h1>
            <p style={{ color: '#c48bba', fontSize: 13, marginTop: 1 }}>Hi, {user.name} ✨</p>
          </div>
        </div>
        <button className="btn-ghost" onClick={onLogout} style={{ padding: '8px 18px', fontSize: 13 }}>
          Logout
        </button>
      </div>

      {/* Quote */}
      <div style={{
        background: 'linear-gradient(135deg, #fff0f5, #f5f0ff)',
        borderRadius: 14, padding: '14px 20px', marginBottom: 18,
        borderLeft: '4px solid #9b5de5',
      }}>
        <p style={{ fontStyle: 'italic', color: '#6b4480', fontSize: 14, lineHeight: 1.7 }}>
          {quote ? `"${quote}"` : ' '}
        </p>
      </div>

      {/* Active period banner */}
      {activeCycle && (
        <div style={{
          background: 'linear-gradient(135deg, #d63384, #9b5de5)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 18,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ color: '#fff' }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>Period in progress</p>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>
              Started {fmt(activeCycle.start_date)}
            </p>
          </div>
          <button
            onClick={handleLogEnd}
            style={{
              background: 'rgba(255,255,255,0.2)', color: '#fff',
              border: '2px solid rgba(255,255,255,0.45)', borderRadius: 10,
              padding: '8px 16px', cursor: 'pointer', fontSize: 13,
              fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            End period
          </button>
        </div>
      )}

      {/* Predictions grid */}
      {prediction ? (
        <>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: '#6b4480', marginBottom: 12, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Predictions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
            <PredCard
              icon="🩸" label="Next Period"
              main={fmt(prediction.nextPeriodStart)}
              sub={daysLabel(prediction.nextPeriodStart)}
              accent="#d63384"
            />
            <PredCard
              icon="🌸" label="Ovulation"
              main={fmt(prediction.ovulationDate)}
              sub={daysLabel(prediction.ovulationDate)}
              accent="#9b5de5"
            />
            <PredCard
              icon="✨" label="Fertile Window"
              main={`${fmt(prediction.fertileStart)}`}
              sub={`→ ${fmt(prediction.fertileEnd)}`}
              accent="#e91e8c"
            />
            <PredCard
              icon="📅" label="Avg Cycle"
              main={`${prediction.avgCycleLength} days`}
              sub={`from ${prediction.dataPoints} cycle${prediction.dataPoints !== 1 ? 's' : ''}`}
              accent="#6b4480"
            />
          </div>
        </>
      ) : !loading && cycles.length === 0 && (
        <div className="card" style={{ marginBottom: 18, padding: '20px', textAlign: 'center', color: '#b09ac2' }}>
          <p style={{ fontSize: 15, marginBottom: 4 }}>No data yet 🌱</p>
          <p style={{ fontSize: 13 }}>Log your first period to see predictions.</p>
        </div>
      )}

      {/* Log period */}
      {!activeCycle && (
        <div style={{ marginBottom: 22 }}>
          {showLogForm ? (
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#3d2b4e' }}>
                When did your period start?
              </h3>
              <input
                type="date" value={logDate}
                onChange={e => setLogDate(e.target.value)}
                style={{ marginBottom: 14 }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-ghost" onClick={() => setShowLogForm(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleLogStart}>
                  Log period
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowLogForm(true)}>
              + Log period start
            </button>
          )}
        </div>
      )}

      {/* Cycle history */}
      <h2 style={{ fontSize: 11, fontWeight: 600, color: '#6b4480', marginBottom: 12, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
        Cycle History
      </h2>

      {loading ? (
        <p style={{ color: '#b09ac2', fontSize: 14 }}>Loading…</p>
      ) : cycles.length === 0 ? (
        <div className="card" style={{ color: '#b09ac2', textAlign: 'center', padding: '18px' }}>
          No cycles logged yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cycles.slice(0, 8).map(c => {
            const duration = c.end_date
              ? Math.round((new Date(c.end_date) - new Date(c.start_date)) / 86400000) + 1
              : null
            return (
              <div key={c.id} className="card" style={{
                padding: '13px 18px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {fmt(c.start_date)}
                    {c.end_date ? <span style={{ color: '#b09ac2', fontWeight: 400 }}> → {fmt(c.end_date)}</span> : ''}
                  </p>
                  {duration && (
                    <p style={{ fontSize: 12, color: '#b09ac2', marginTop: 2 }}>{duration} days</p>
                  )}
                </div>
                {!c.end_date && (
                  <span style={{
                    background: '#fff0f5', color: '#d63384', fontSize: 11,
                    fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  }}>
                    Active
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
