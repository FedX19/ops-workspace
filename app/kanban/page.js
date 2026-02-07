'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import Link from 'next/link'

export default function KanbanPage() {
  const [columns, setColumns] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [newCardColumn, setNewCardColumn] = useState(null)
  const [newCardTitle, setNewCardTitle] = useState('')

  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => {
      const session = data.session?.user
      setUser(session || null)
      if (!session) window.location.href = '/login'
    })

    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [columnsRes, cardsRes] = await Promise.all([
        fetch('/api/kanban/columns'),
        fetch('/api/kanban/cards'),
      ])
      const columnsData = await columnsRes.json()
      const cardsData = await cardsRes.json()
      
      setColumns(columnsData || [])
      setCards(cardsData || [])
    } catch (err) {
      console.error('Failed to fetch kanban data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addCard(columnId) {
    if (!newCardTitle.trim()) return
    
    try {
      const res = await fetch('/api/kanban/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          column_id: columnId,
          title: newCardTitle,
          owner: user?.email || null,
        }),
      })
      const newCard = await res.json()
      setCards([...cards, newCard])
      setNewCardTitle('')
      setNewCardColumn(null)
    } catch (err) {
      console.error('Failed to add card:', err)
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
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
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
          📊 Kanban Board
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 14,
          color: '#666',
        }}>
          Track tasks and progress
        </p>

        {/* Kanban Columns */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            Loading board...
          </div>
        ) : columns.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            No columns yet. Create your first column to get started.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {columns.map((column) => (
              <div
                key={column.id}
                style={{
                  background: '#f0f0f0',
                  borderRadius: 12,
                  padding: 16,
                  minHeight: 400,
                }}
              >
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#555',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  {column.title}
                </h3>

                {/* Cards */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {cards
                    .filter((card) => card.column_id === column.id)
                    .map((card) => (
                      <div
                        key={card.id}
                        style={{
                          background: 'white',
                          borderRadius: 8,
                          padding: 16,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        <h4 style={{
                          margin: '0 0 8px 0',
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#333',
                        }}>
                          {card.title}
                        </h4>
                        {card.body && (
                          <p style={{
                            margin: '0 0 8px 0',
                            fontSize: 12,
                            color: '#666',
                            lineHeight: 1.5,
                          }}>
                            {card.body}
                          </p>
                        )}
                        {card.owner && (
                          <p style={{
                            margin: 0,
                            fontSize: 11,
                            color: '#999',
                          }}>
                            {card.owner}
                          </p>
                        )}
                      </div>
                    ))}

                  {/* Add Card */}
                  {newCardColumn === column.id ? (
                    <div style={{
                      background: 'white',
                      borderRadius: 8,
                      padding: 12,
                    }}>
                      <input
                        type="text"
                        placeholder="Card title..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addCard(column.id)
                          if (e.key === 'Escape') setNewCardColumn(null)
                        }}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: 8,
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          fontSize: 14,
                          marginBottom: 8,
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => addCard(column.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setNewCardColumn(null)}
                          style={{
                            padding: '6px 12px',
                            background: '#f0f0f0',
                            color: '#666',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setNewCardColumn(column.id)}
                      style={{
                        padding: 12,
                        background: 'rgba(0,0,0,0.05)',
                        color: '#999',
                        border: '2px dashed #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(0,0,0,0.08)'
                        e.target.style.borderColor = '#ccc'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(0,0,0,0.05)'
                        e.target.style.borderColor = '#ddd'
                      }}
                    >
                      + Add card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
