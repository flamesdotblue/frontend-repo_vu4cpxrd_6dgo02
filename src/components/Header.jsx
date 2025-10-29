import { Home, User } from 'lucide-react'

export default function Header({ onLoginClick, user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600 text-white"><Home size={20} /></div>
          <div className="leading-tight">
            <p className="font-semibold text-gray-900">SwiftFix</p>
            <p className="text-xs text-gray-500">Emergency Home Services</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User size={18} className="text-gray-500" />
                <span>{user.name}</span>
              </div>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700">Logout</button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">Login / Register</button>
          )}
        </div>
      </div>
    </header>
  )
}
