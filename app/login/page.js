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
      console.log('Attempting login for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      console.log('Login successful, session:', data.session)
      console.log('Session user:', data.session?.user?.email)
      console.log('Access token:', data.session?.access_token?.substring(0, 20) + '...')
      
      // Wait a moment for session to fully establish
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check session was saved
      const { data: checkData } = await supabase.auth.getSession()
      console.log('Session check after login:', checkData.session?.user?.email)
      
      if (!checkData.session) {
        throw new Error('Session not established after login')
      }
      
      console.log('Redirecting to home...')
      
      // Use router.push to trigger middleware properly
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.message)
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
          
          <div style={{
            marginTop: 16,
            fontSize: 11,
            color: '#666',
            textAlign: 'center',
          }}>
            Check browser console (F12) for debug info
          </div>
        </div>
      </div>
    </div>
  )
}
