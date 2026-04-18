'use client'

import { useState, useEffect } from 'react'
import { verifyAdmin } from '@/actions/verifyAdmin'

interface AdminPINGuardProps {
  children: React.ReactNode
}

export default function AdminPINGuard({ children }: AdminPINGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('admin_auth') === 'true')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await verifyAdmin(password)
    
    if (isValid) {
      localStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      window.location.reload()
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (isAuthenticated === null) return null // Initial check

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950">
        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6 text-center">
          <header className="space-y-1">
            <h1 className="text-2xl font-serif text-stone-100">Admin Access</h1>
            <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">Floor Manager Terminal</p>
          </header>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="ENTER PASSWORD"
              className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-stone-800'} rounded-sm px-4 py-3 text-center text-stone-100 font-mono focus:outline-none focus:border-gold/50 transition-all`}
            />
            {error && <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Invalid Credentials</p>}
          </div>

          <button
            type="submit"
            className="w-full border border-stone-500 text-stone-200 py-3 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-stone-800 transition-all"
          >
            Authenticate
          </button>
        </form>
      </div>
    )
  }

  return <>{children}</>
}
