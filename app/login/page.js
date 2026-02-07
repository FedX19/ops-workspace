'use client'
import { useState } from 'react'
import { isAllowedEmail } from '@/lib/allowedUsers'
import { createClient } from '@/lib/supabase/browser'

export default function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('[Login] Magic link requested for:', email)

    // Email whitelist check
    if (!isAllowedEmail(email)) {
      setError('Access denied. This email is not authorized.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (authError) {
        console.error('[Login] Auth error:', authError)
        setError(authError.message)
        setLoading(false)
        return
      }
      
      console.log('[Login] Magic link sent to:', email)
      setSent(true)
      setLoading(false)
      
    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Failed to send magic link')
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
          {!sent ? (
            <>
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
                  placeholder="Enter your email"
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
                    boxSizing: 'border-box',
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
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{
                margin: '0 0 16px 0',
                fontSize: 28,
                fontWeight: 700,
                color: '#7fff00',
                textAlign: 'center',
              }}>
                Check Your Email ✓
              </h2>
              <p style={{
                fontSize: 16,
                color: '#ccc',
                textAlign: 'center',
                margin: 0,
              }}>
                A magic link has been sent to <strong>{email}</strong>. Click it to sign in.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                style={{
                  marginTop: 24,
                  width: '100%',
                  padding: 12,
                  fontSize: 14,
                  color: '#00d4ff',
                  background: 'transparent',
                  border: '1px solid rgba(0, 212, 255, 0.5)',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Try a different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
