import { useState, useEffect } from 'react'
import { getQuote, getUsers, createUser } from '../api'

const AVATAR_COLORS = ['#d63384', '#9b5de5', '#e91e8c', '#6b4480', '#c2185b']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

export default function Home({ onSelectUser }) {
  const [quote, setQuote]       = useState('')
  const [users, setUsers]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ name: '', email: '', dob: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    getQuote().then(d => setQuote(d.quote)).catch(() => {})
    getUsers().then(setUsers).catch(() => {})
  }, [])

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await createUser(form)
      if (res.error) { setError(res.error); return }
      if (res.quote) setQuote(res.quote)
      onSelectUser(res.user)
    } catch { setError('Could not connect to server.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 460, margin: '0 auto', padding: '48px 20px' }}>

      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <img src="/Lutia.png" alt="Lutea" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          <h1 style={{ fontSize: 48, fontWeight: 700, color: '#d63384', letterSpacing: '-1px' }}>
            Lutea
          </h1>
        </div>
        <p style={{ color: '#c48bba', fontSize: 14, marginTop: 6 }}><b>Your Cycle, Your Rhythm</b></p>
      </div>

      {/* Quote */}
      <div style={{
        background: 'linear-gradient(135deg, #fff0f5 0%, #f5f0ff 100%)',
        borderRadius: 16, padding: '18px 22px', marginBottom: 28,
        borderLeft: '4px solid #d63384',
      }}>
        <p style={{ fontStyle: 'italic', color: '#6b4480', fontSize: 15, lineHeight: 1.7 }}>
          {quote ? `"${quote}"` : ' '}
        </p>
      </div>

      {/* Card: user list or create form */}
      <div className="card">
        {!showForm ? (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 18, color: '#3d2b4e' }}>
              {users.length ? 'Welcome back 👋' : 'Start your journey'}
            </h2>

            {users.map(u => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                  padding: '11px 14px', marginBottom: 10,
                  background: '#fffbfd', border: '2px solid #f0d0e8', borderRadius: 13,
                  cursor: 'pointer', fontSize: 15, color: '#3d2b4e', textAlign: 'left',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#d63384'; e.currentTarget.style.background = '#fff5fa' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0d0e8'; e.currentTarget.style.background = '#fffbfd' }}
              >
                <span style={{
                  flexShrink: 0, width: 38, height: 38, background: avatarColor(u.name),
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15,
                }}>
                  {u.name[0].toUpperCase()}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#b09ac2', marginTop: 1 }}>{u.email}</div>
                </div>
              </button>
            ))}

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: users.length ? 6 : 0 }}
              onClick={() => setShowForm(true)}
            >
              + New User
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: '#3d2b4e' }}>
              Create your profile
            </h2>
            <p style={{ color: '#b09ac2', fontSize: 13, marginBottom: 22 }}>
              We'll personalise your predictions just for you.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Your name</label>
                <input type="text" placeholder="e.g. Priya" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label>Email address</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label>Date of birth <span style={{ color: '#d0b0d8' }}>(optional)</span></label>
                <input type="date" value={form.dob} onChange={set('dob')} />
              </div>

              {error && (
                <p style={{ color: '#e63946', fontSize: 13, background: '#fff0f0', padding: '8px 12px', borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setError('') }}>
                  Back
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Creating…' : 'Start tracking ✨'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
