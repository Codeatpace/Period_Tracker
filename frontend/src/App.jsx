import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return user
    ? <Dashboard user={user} onLogout={() => setUser(null)} />
    : <Auth onSelectUser={setUser} />
}
