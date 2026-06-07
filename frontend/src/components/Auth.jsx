import { useState } from 'react'
import { createUser, signIn, getQuote } from '../api'

const AVATAR_COLORS = ['#d63384', '#9b5de5', '#e91e8c', '#6b4480', '#c2185b']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

export default function Auth({ onSelectUser }) {
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ email: '', name: '', dob: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn({ email: form.email })
      if (res.error) { setError(res.error); return }
      onSelectUser(res.user)
    } catch { setError('Could not connect to server.') }
    finally { setLoading(false) }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await createUser({ name: form.name, email: form.email, dob: form.dob })
      if (res.error) { setError(res.error); return }
      onSelectUser(res.user)
    } catch { setError('Could not connect to server.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 460, margin: '0 auto', padding: '48px 20px' }}>

      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <img src="/Lutia.png" alt="Lutia" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          <h1 style={{ fontSize: 48, fontWeight: 700, color: '#d63384', letterSpacing: '-1px' }}>
            Lutia
          </h1>
        </div>
        <p style={{ color: '#c48bba', fontSize: 14, marginTop: 6 }}><b>Your Cycle, Your Rhythm</b></p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
        <button
          onClick={() => { setTab('signin'); setError(''); setForm({ email: '', name: '', dob: '' }) }}
          style={{
            flex: 1, padding: '12px 16px', border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            background: tab === 'signin' ? '#d63384' : '#f0d0e8',
            color: tab === 'signin' ? '#fff' : '#6b4480',
            transition: 'all 0.2s',
          }}
        >
          Login
        </button>
        <button
          onClick={() => { setTab('signup'); setError(''); setForm({ email: '', name: '', dob: '' }) }}
          style={{
            flex: 1, padding: '12px 16px', border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            background: tab === 'signup' ? '#9b5de5' : '#f0d0e8',
            color: tab === 'signup' ? '#fff' : '#6b4480',
            transition: 'all 0.2s',
          }}
        >
          Register
        </button>
      </div>

      {/* Form Card */}
      <div className="card">
        {tab === 'signin' ? (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: '#3d2b4e' }}>
              Welcome back
            </h2>
            <p style={{ color: '#b09ac2', fontSize: 13, marginBottom: 22 }}>
              Login with your email to continue.
            </p>

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>

              {error && (
                <p style={{ color: '#e63946', fontSize: 13, background: '#fff0f0', padding: '8px 12px', borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: '#3d2b4e' }}>
              Create your profile
            </h2>
            <p style={{ color: '#b09ac2', fontSize: 13, marginBottom: 22 }}>
              We'll personalise your predictions just for you.
            </p>

            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Your name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
              <div>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
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

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating…' : 'Start tracking ✨'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
