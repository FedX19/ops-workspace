'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
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
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>🚀 Ops Workspace</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Signed in as: {user.email}</p>

      {loading ? (
        <p>Loading brief...</p>
      ) : brief ? (
        <div style={{
          border: '1px solid #667eea',
          borderRadius: 8,
          padding: 16,
          backgroundColor: '#f0f4ff',
          marginBottom: 24
        }}>
          <h2 style={{ marginTop: 0, color: '#667eea' }}>📋 Today's Brief</h2>
          <p style={{ color: '#999', fontSize: 12 }}>{brief.date}</p>
          
          {brief.priorities && brief.priorities.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, color: '#d63384', marginBottom: 6 }}>CRITICAL</h3>
              <ul style={{ marginLeft: 16, color: '#666' }}>
                {brief.priorities.slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          <Link href="/briefs" style={{
            display: 'inline-block',
            padding: '8px 12px',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: 12
          }}>
            View Full Brief →
          </Link>
        </div>
      ) : (
        <p>No brief yet for today.</p>
      )}

      <nav style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Navigation</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: 8 }}><Link href="/briefs">📋 Briefs Archive</Link></li>
          <li style={{ marginBottom: 8 }}><Link href="/kanban">📊 Kanban (Tasks)</Link></li>
          <li style={{ marginBottom: 8 }}><Link href="/approvals">✅ Approvals</Link></li>
          <li style={{ marginBottom: 8 }}><Link href="/feed">📰 Activity Feed</Link></li>
        </ul>
      </nav>

      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          marginTop: 24,
          padding: '8px 16px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Sign Out
      </button>
    </div>
  )
}
