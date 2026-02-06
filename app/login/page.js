'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('password') // 'password' or 'magic'
  const [isSignUp, setIsSignUp] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = '/'
      }
    })
  }, [])

  const handlePasswordAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSent(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email) {
      setError('Please enter your email')
      setLoading(false)
      return
    }

    try {
      const redirectTo = typeof window !== 'undefined' 
        ? window.location.origin + '/auth/callback' 
        : undefined

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      })

      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send magic link')
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
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00d4ff 2px, #00d4ff 4px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 450,
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 48,
        }}>
          <img
            src="/logo.jpg"
            alt="Ops Workspace"
            style={{
              maxWidth: 300,
              width: '100%',
              height: 'auto',
              marginBottom: 24,
            }}
          />
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)',
        }}>
          {!sent ? (
            <>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: 28,
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
              }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{
                margin: '0 0 32px 0',
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
              }}>
                {mode === 'password' ? (isSignUp ? 'Set up your account' : 'Sign in with your password') : 'Sign in with magic link'}
              </p>

              {/* Mode Toggle */}
              <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 24,
                padding: 4,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 8,
              }}>
                <button
                  onClick={() => setMode('password')}
                  style={{
                    flex: 1,
                    padding: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    color: mode === 'password' ? '#0a0a0a' : 'rgba(255, 255, 255, 0.6)',
                    background: mode === 'password' ? 'linear-gradient(135deg, #00d4ff 0%, #7fff00 100%)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Password
                </button>
                <button
                  onClick={() => setMode('magic')}
                  style={{
                    flex: 1,
                    padding: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    color: mode === 'magic' ? '#0a0a0a' : 'rgba(255, 255, 255, 0.6)',
                    background: mode === 'magic' ? 'linear-gradient(135deg, #00d4ff 0%, #7fff00 100%)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Magic Link
                </button>
              </div>

              <form onSubmit={mode === 'password' ? handlePasswordAuth : handleMagicLink}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00d4ff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'
                    e.target.style.boxShadow = 'none'
                  }}
                />

                {mode === 'password' && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00d4ff'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                )}

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
                    transition: 'all 0.2s',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 24px rgba(0, 212, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  {loading ? 'Loading...' : (
                    mode === 'password' ? (isSignUp ? 'Create Account' : 'Sign In') : 'Send Magic Link'
                  )}
                </button>
              </form>

              {mode === 'password' && (
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '10px 20px',
                    fontSize: 14,
                    color: '#00d4ff',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
              )}

              <p style={{
                margin: '24px 0 0 0',
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.4)',
                textAlign: 'center',
              }}>
                {mode === 'password' ? 'Fast and secure password login' : 'Click the link in your email to sign in'}
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7fff00 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}>
                ✓
              </div>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: 24,
                fontWeight: 700,
                color: 'white',
              }}>
                {mode === 'password' && isSignUp ? 'Check your email' : 'Success!'}
              </h3>
              <p style={{
                margin: '0 0 24px 0',
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.6,
              }}>
                {mode === 'password' && isSignUp ? (
                  <>We sent a confirmation link to<br /><strong style={{ color: '#00d4ff' }}>{email}</strong></>
                ) : (
                  <>We sent a magic link to<br /><strong style={{ color: '#00d4ff' }}>{email}</strong></>
                )}
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  marginTop: 24,
                  padding: '10px 20px',
                  fontSize: 14,
                  color: '#00d4ff',
                  background: 'transparent',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Back to login
              </button>
            </div>
          )}
        </div>

        <p style={{
          marginTop: 32,
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.3)',
          textAlign: 'center',
        }}>
          Ops Workspace © 2026 • Secure & encrypted
        </p>
      </div>
    </div>
  )
}
