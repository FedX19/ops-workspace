'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import Link from 'next/link'

export default function BriefsPage() {
  const [briefs, setBriefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    // TEMP: Auth disabled for testing
    setUser({ email: 'test@example.com' })
    fetchBriefs()
  }, [])

  async function fetchBriefs() {
    try {
      const res = await fetch('/api/briefs')
      const data = await res.json()
      setBriefs(data || [])
    } catch (err) {
      console.error('Failed to fetch briefs:', err)
    } finally {
      setLoading(false)
    }
  }

  function toggleSection(briefId, sectionId) {
    setExpandedSections(prev => ({
      ...prev,
      [`${briefId}-${sectionId}`]: !prev[`${briefId}-${sectionId}`]
    }))
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
          📋 Interactive Briefs
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 14,
          color: '#666',
        }}>
          Daily strategic newsletter with research and outlines
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
            gap: 24,
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
                }}
              >
                <h2 style={{
                  margin: '0 0 4px 0',
                  fontSize: 24,
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

                {/* Interactive Sections */}
                {brief.sections && brief.sections.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: 24 }}>
                    <div
                      onClick={() => toggleSection(brief.id, idx)}
                      style={{
                        cursor: 'pointer',
                        padding: 16,
                        background: '#f9f9f9',
                        borderRadius: 8,
                        borderLeft: `4px solid ${section.color || '#667eea'}`,
                        marginBottom: 8,
                      }}
                    >
                      <h3 style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        {section.icon} {section.title}
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {expandedSections[`${brief.id}-${idx}`] ? '▲' : '▼'}
                        </span>
                      </h3>
                    </div>

                    {expandedSections[`${brief.id}-${idx}`] && (
                      <div style={{
                        padding: 16,
                        background: '#fafafa',
                        borderRadius: 8,
                        marginBottom: 16,
                      }}>
                        {section.content && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ margin: 0, fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                              {section.content}
                            </p>
                          </div>
                        )}

                        {section.steps && (
                          <div style={{ marginBottom: 16 }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: '#667eea' }}>
                              📝 Step-by-step outline
                            </h4>
                            <ol style={{ margin: 0, paddingLeft: 20 }}>
                              {section.steps.map((step, i) => (
                                <li key={i} style={{ marginBottom: 8, fontSize: 14, color: '#555' }}>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {section.links && section.links.length > 0 && (
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: '#667eea' }}>
                              🔗 Resources
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {section.links.map((link, i) => (
                                <li key={i} style={{ marginBottom: 4 }}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 14, color: '#667eea', textDecoration: 'none' }}
                                  >
                                    {link.title} →
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Research Links */}
                {brief.research_links && brief.research_links.length > 0 && (
                  <div style={{
                    marginTop: 24,
                    padding: 16,
                    background: '#f0f4ff',
                    borderRadius: 8,
                  }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700, color: '#667eea' }}>
                      🔍 RESEARCH & COMPETITORS
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}>
                      {brief.research_links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 14,
                            color: '#667eea',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span>{link.title}</span>
                          <span style={{ fontSize: 11, color: '#999' }}>↗</span>
                        </a>
                      ))}
                    </div>
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
