'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      if (!data.session?.user) {
        window.location.href = '/login'
      }
    })

    fetchLatestBrief()
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

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      paddingTop: 40,
      paddingBottom: 40,
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
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

        {/* Today's Brief Card */}
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
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)'
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
                letterSpacing: 1,
              }}>
                {brief.date}
              </p>

              {brief.priorities && brief.priorities.length > 0 && (
                <div style={{
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#d63384',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    🔴 CRITICAL
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 0,
                    listStyle: 'none',
                  }}>
                    {brief.priorities.slice(0, 2).map((p, i) => (
                      <li key={i} style={{
                        fontSize: 14,
                        color: '#555',
                        marginBottom: 8,
                        lineHeight: 1.5,
                      }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {brief.opportunities && brief.opportunities.length > 0 && (
                <div style={{
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#28a745',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    💡 OPPORTUNITIES
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 0,
                    listStyle: 'none',
                  }}>
                    {brief.opportunities.slice(0, 1).map((o, i) => (
                      <li key={i} style={{
                        fontSize: 14,
                        color: '#555',
                        lineHeight: 1.5,
                      }}>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p style={{
                margin: 0,
                fontSize: 12,
                color: '#00d4ff',
                fontWeight: 600,
              }}>
                View full brief →
              </p>
            </div>
          </Link>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 32,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            marginBottom: 32,
            textAlign: 'center',
            color: '#999',
          }}>
            No brief yet for today.
          </div>
        )}

        {/* Navigation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {[
            { href: '/briefs', icon: '📋', label: 'Briefs', desc: 'Archive & history' },
            { href: '/kanban', icon: '📊', label: 'Kanban', desc: 'Tasks & sprints' },
            { href: '/approvals', icon: '✅', label: 'Approvals', desc: 'Decisions' },
            { href: '/feed', icon: '📰', label: 'Feed', desc: 'Activity log' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {item.icon}
                </div>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#333',
                }}>
                  {item.label}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#999',
                }}>
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
