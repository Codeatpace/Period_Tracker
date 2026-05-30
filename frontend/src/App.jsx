import { useState } from 'react'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)

  return user
    ? <Dashboard user={user} onLogout={() => setUser(null)} />
    : <Home onSelectUser={setUser} />
}
