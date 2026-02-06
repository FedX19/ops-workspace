'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function FeedPage() {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session?.user
      setUser(session || null)
      if (!session) window.location.href = '/login'
    })

    fetchFeed()
  }, [])

  async function fetchFeed() {
    try {
      const res = await fetch('/api/feed')
      const data = await res.json()
      setFeed(data || [])
    } catch (err) {
      console.error('Failed to fetch feed:', err)
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
          📰 Activity Feed
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 14,
          color: '#666',
        }}>
          Recent events and activity log
        </p>

        {/* Feed Timeline */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            Loading feed...
          </div>
        ) : feed.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            No activity yet.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {feed.map((item, i) => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  padding: '16px 20px',
                  borderLeft: i === 0 ? '3px solid #667eea' : '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9f9f9'
                  e.currentTarget.style.borderLeftColor = '#667eea'
                  e.currentTarget.style.borderLeftWidth = '3px'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  if (i !== 0) {
                    e.currentTarget.style.borderLeftColor = '#e8e8e8'
                    e.currentTarget.style.borderLeftWidth = '1px'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    {item.actor && (
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#667eea',
                        marginRight: 8,
                      }}>
                        {item.actor}
                      </span>
                    )}
                    <span style={{
                      fontSize: 14,
                      color: '#333',
                      lineHeight: 1.6,
                    }}>
                      {item.summary}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11,
                    color: '#999',
                    whiteSpace: 'nowrap',
                    marginLeft: 16,
                  }}>
                    {new Date(item.time).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
