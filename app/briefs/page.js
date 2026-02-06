'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function BriefsPage() {
  const [briefs, setBriefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session?.user
      setUser(session || null)
      if (!session) window.location.href = '/login'
    })

    fetchBriefs()
  }, [])

  async function fetchBriefs() {
    try {
      const res = await fetch('/api/briefs')
      const data = await res.json()
      setBriefs(data)
    } catch (err) {
      console.error('Failed to fetch briefs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <div style={{
      background: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: 40,
      paddingBottom: 40,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <Link href="/" style={{ textDecoration: 'none', color: '#667eea', fontWeight: 600, fontSize: 14, marginBottom: 32, display: 'inline-block' }}>
          ← Home
        </Link>

        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: 32,
          fontWeight: 700,
          color: '#333',
        }}>
          📋 Briefs Archive
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 14,
          color: '#666',
        }}>
          Daily priorities and strategic context
        </p>

        {/* Briefs List */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            color: '#999',
            padding: 40,
          }}>
            Loading briefs...
          </div>
        ) : briefs.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            No briefs yet.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {briefs.map((brief) => (
              <div
                key={brief.id}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 32,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = '#ddd'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                  e.currentTarget.style.borderColor = '#e8e8e8'
                }}
              >
                <h2 style={{
                  margin: '0 0 4px 0',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#333',
                }}>
                  {brief.date}
                </h2>
                {brief.title && (
                  <p style={{
                    margin: '0 0 24px 0',
                    fontSize: 14,
                    color: '#666',
                  }}>
                    {brief.title}
                  </p>
                )}

                {/* Priorities */}
                {brief.priorities && brief.priorities.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
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
                      paddingLeft: 20,
                      color: '#555',
                    }}>
                      {brief.priorities.map((p, i) => (
                        <li key={i} style={{
                          marginBottom: 8,
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Opportunities */}
                {brief.opportunities && brief.opportunities.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
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
                      paddingLeft: 20,
                      color: '#555',
                    }}>
                      {brief.opportunities.map((o, i) => (
                        <li key={i} style={{
                          marginBottom: 8,
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Blockers */}
                {brief.blockers && brief.blockers.length > 0 && (
                  <div>
                    <h3 style={{
                      margin: '0 0 12px 0',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#ffc107',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                      ⚠️ BLOCKERS
                    </h3>
                    <ul style={{
                      margin: 0,
                      paddingLeft: 20,
                      color: '#555',
                    }}>
                      {brief.blockers.map((b, i) => (
                        <li key={i} style={{
                          marginBottom: 8,
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
