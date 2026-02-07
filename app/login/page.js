'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAllowedEmail } from '@/lib/allowedUsers'
import { createClient } from '@/lib/supabase/browser'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('[Login] Form submitted')

    // Email whitelist check
    if (!isAllowedEmail(email)) {
      setError('Access denied. This email is not authorized.')
      setLoading(false)
      return
    }

    try {
      console.log('[Login] Creating client and signing in...')
      
      const supabase = createClient()
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) {
        console.error('[Login] Auth error:', authError)
        setError(authError.message)
        setLoading(false)
        return
      }
      
      console.log('[Login] Success! Session:', data.session?.user?.email)
      console.log('[Login] Redirecting to home...')
      
      // Force full page reload to ensure cookies and middleware work
      window.location.href = '/'
      
    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Login failed')
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
