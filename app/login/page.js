'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '../../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log('Already logged in, redirecting')
        window.location.href = '/'
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabase()
    if (!supabase) {
      setError('App not initialized')
      setLoading(false)
      return
    }

    try {
      console.log('Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Login success:', data.session)
      
      // Session is now stored in localStorage automatically
      // Redirect immediately
      window.location.href = '/'
    } catch (err) {
      setError(err.message)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ maxWidth: 450, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img
            src="/logo.jpg"
            alt="Ops Workspace"
            style={{ maxWidth: 300, width: '100%', height: 'auto' }}
          />
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 16,
          padding: 40,
        }}>
          <h2 style={{
            margin: '0 0 32px 0',
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
          }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: 16,
                fontSize: 16,
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                marginBottom: 16,
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: 16,
                fontSize: 16,
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                marginBottom: 16,
              }}
            />

            {error && (
              <div style={{
                padding: 12,
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: 8,
                color: '#ff6b6b',
                fontSize: 14,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                fontSize: 16,
                fontWeight: 700,
                color: '#0a0a0a',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7fff00 100%)',
                border: 'none',
                borderRadius: 12,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
