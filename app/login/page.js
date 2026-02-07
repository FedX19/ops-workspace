'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { isAllowedEmail } from '@/lib/allowedUsers'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log('Already logged in, redirecting')
        router.push('/')
      }
    })
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Email whitelist check
    if (!isAllowedEmail(email)) {
      setError('Access denied. This email is not authorized.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      console.log('Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Login success:', data.session)
      
      // Force a hard refresh to trigger middleware
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
              disabled={loading}
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
              disabled={loading}
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
                marginBottom: 16,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#fca5a5',
                fontSize: 14,
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
                background: loading ? '#999' : 'linear-gradient(135deg, #00d4ff 0%, #7fff00 100%)',
                border: 'none',
                borderRadius: 12,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
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
