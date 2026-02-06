'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Image from 'next/image'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = '/'
      }
    })
  }, [])

  const handleSubmit = async (e) => {
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
      {/* Matrix-style background effect */}
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
        {/* Logo */}
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

        {/* Login Card */}
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
                Welcome Back
              </h2>
              <p style={{
                margin: '0 0 32px 0',
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
              }}>
                Sign in with magic link — no password needed
              </p>

              <form onSubmit={handleSubmit}>
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
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>

              <p style={{
                margin: '24px 0 0 0',
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.4)',
                textAlign: 'center',
              }}>
                Click the link in your email to sign in securely
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
                Check your email
              </h3>
              <p style={{
                margin: '0 0 24px 0',
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.6,
              }}>
                We sent a magic link to<br />
                <strong style={{ color: '#00d4ff' }}>{email}</strong>
              </p>
              <p style={{
                margin: 0,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.4)',
              }}>
                Click the link to sign in instantly
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
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
                Use different email
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
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
