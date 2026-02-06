'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newRisk, setNewRisk] = useState('medium')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session?.user
      setUser(session || null)
      if (!session) window.location.href = '/login'
    })

    fetchApprovals()
  }, [])

  async function fetchApprovals() {
    try {
      const res = await fetch('/api/approvals')
      const data = await res.json()
      setApprovals(data || [])
    } catch (err) {
      console.error('Failed to fetch approvals:', err)
    } finally {
      setLoading(false)
    }
  }

  async function createApproval() {
    if (!newTitle.trim()) return

    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          risk: newRisk,
        }),
      })
      const approval = await res.json()
      setApprovals([approval, ...approvals])
      setNewTitle('')
      setShowForm(false)
    } catch (err) {
      console.error('Failed to create approval:', err)
    }
  }

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#28a745'
      case 'medium': return '#ffc107'
      case 'high': return '#dc3545'
      default: return '#999'
    }
  }

  const getStateColor = (state) => {
    switch (state) {
      case 'pending': return '#ffc107'
      case 'approved': return '#28a745'
      case 'rejected': return '#dc3545'
      default: return '#999'
    }
  }

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: 32,
              fontWeight: 700,
              color: '#333',
            }}>
              ✅ Approvals
            </h1>
            <p style={{
              margin: 0,
              fontSize: 14,
              color: '#666',
            }}>
              Decision gates and approval workflow
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#5568d3'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#667eea'
            }}
          >
            + New Request
          </button>
        </div>

        {/* New Approval Form */}
        {showForm && (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#333' }}>
              New Approval Request
            </h3>
            <input
              type="text"
              placeholder="What needs approval?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 12,
              }}
            />
            <select
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value)}
              style={{
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={createApproval}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Approvals List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            Loading approvals...
          </div>
        ) : approvals.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            No approvals yet.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {approvals.map((approval) => (
              <div
                key={approval.id}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#333',
                    }}>
                      {approval.title}
                    </h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: getRiskColor(approval.risk) + '20',
                        color: getRiskColor(approval.risk),
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 4,
                        textTransform: 'uppercase',
                      }}>
                        {approval.risk} risk
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        background: getStateColor(approval.state) + '20',
                        color: getStateColor(approval.state),
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 4,
                        textTransform: 'uppercase',
                      }}>
                        {approval.state}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    color: '#999',
                  }}>
                    {new Date(approval.created_at).toLocaleDateString()}
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
