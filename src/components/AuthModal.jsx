import { useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${backend}/auth/login` : `${backend}/auth/register`
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Request failed')
      }
      const user = await res.json()
      onAuthed(user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">{mode === 'login' ? 'Login' : 'Create account'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          {mode === 'register' && (
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required placeholder="Full name" className="w-full rounded-md border px-3 py-2" />
          )}
          <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required type="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" />
          <input value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" />
          {mode === 'register' && (
            <>
              <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="w-full rounded-md border px-3 py-2" />
              <input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} placeholder="Address" className="w-full rounded-md border px-3 py-2" />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button disabled={loading} className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
          </button>

          <p className="text-sm text-center text-gray-600">
            {mode === 'login' ? (
              <>No account? <button type="button" onClick={()=>setMode('register')} className="text-blue-600 hover:underline">Register</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={()=>setMode('login')} className="text-blue-600 hover:underline">Login</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
