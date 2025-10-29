import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import WorkersSection from './components/WorkersSection'
import AuthModal from './components/AuthModal'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogout = () => setUser(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header onLoginClick={()=>setAuthOpen(true)} user={user} onLogout={handleLogout} />
      <Hero />
      <WorkersSection user={user} />
      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
          <p>© {new Date().getFullYear()} SwiftFix. All rights reserved.</p>
          <p>Need urgent help? Call 1800-000-911</p>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthed={setUser} />
    </div>
  )
}

export default App
