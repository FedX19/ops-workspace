'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session?.user) {
        window.location.href = '/login'
        return
      }
      setUser(data.session.user)
      fetchLatestBrief()
    })
  }, [])

  async function fetchLatestBrief() {
    try {
      const res = await fetch('/api/briefs')
      const data = await res.json()
      if (data && data.length > 0) {
        setBrief(data[0])
      }
    } catch (err) {
      console.error('Failed to fetch brief:', err)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return <div style={{ padding: 20, color: 'white' }}>Loading...</div>

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      paddingTop: 40,
      paddingBottom: 40,
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            color: 'white',
            marginBottom: 8,
          }}>
            🚀 Ops Workspace
          </h1>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
          }}>
            Welcome back, {user.email.split('@')[0]}
          </p>
        </div>

        {loading ? (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 32,
            color: 'white',
            textAlign: 'center',
            fontSize: 14,
          }}>
            Loading brief...
          </div>
        ) : brief ? (
          <Link href="/briefs" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: 32,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              marginBottom: 32,
              cursor: 'pointer',
            }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: 24,
                fontWeight: 700,
                color: '#333',
              }}>
                📋 Today's Brief
              </h2>
              <p style={{
                margin: '0 0 24px 0',
                fontSize: 12,
                color: '#999',
                textTransform: 'uppercase',
              }}>
                {brief.date}
              </p>

              {brief.priorities && brief.priorities.length > 0 && (
                <div>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#d63384',
                    textTransform: 'uppercase',
                  }}>
                    🔴 CRITICAL
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                    {brief.priorities.slice(0, 2).map((p, i) => (
                      <li key={i} style={{
                        fontSize: 14,
                        color: '#555',
                        marginBottom: 8,
                      }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 32,
            textAlign: 'center',
            color: '#999',
          }}>
            No brief yet for today.
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {[
            { href: '/briefs', icon: '📋', label: 'Briefs' },
            { href: '/kanban', icon: '📊', label: 'Kanban' },
            { href: '/approvals', icon: '✅', label: 'Approvals' },
            { href: '/feed', icon: '📰', label: 'Feed' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {item.icon}
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#333',
                }}>
                  {item.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={signOut}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
