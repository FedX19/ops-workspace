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
  if (loading) return <div style={{ padding: 20 }}>Fetching briefs...</div>

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/">← Home</Link>
      </div>
      <h1>📋 Briefs Archive</h1>
      {briefs.length === 0 ? (
        <p>No briefs yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {briefs.map((brief) => (
            <div key={brief.id} style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              backgroundColor: '#f9f9f9'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>{brief.date}</h2>
              {brief.title && <p style={{ color: '#666', marginBottom: 12 }}>{brief.title}</p>}
              
              {brief.priorities && brief.priorities.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, color: '#d63384', marginBottom: 6 }}>CRITICAL</h3>
                  <ul style={{ marginLeft: 16, color: '#666' }}>
                    {brief.priorities.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {brief.opportunities && brief.opportunities.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, color: '#28a745', marginBottom: 6 }}>OPPORTUNITIES</h3>
                  <ul style={{ marginLeft: 16, color: '#666' }}>
                    {brief.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}

              {brief.blockers && brief.blockers.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 14, color: '#ffc107', marginBottom: 6 }}>BLOCKERS</h3>
                  <ul style={{ marginLeft: 16, color: '#666' }}>
                    {brief.blockers.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
