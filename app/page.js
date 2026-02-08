import Link from 'next/link'

export default async function HomePage() {
  // TEMP: Auth disabled for testing - showing dashboard without login
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      paddingTop: 60,
      paddingBottom: 60,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 60, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            margin: '0 0 16px 0',
          }}>
            Ops Workspace
          </h1>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
          }}>
            Your command center for strategic operations
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          <Link href="/briefs" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
            }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#333',
                margin: '0 0 8px 0',
              }}>
                Daily Briefs
              </h2>
              <p style={{
                fontSize: 14,
                color: '#666',
                margin: 0,
              }}>
                Strategic intelligence and daily summaries
              </p>
            </div>
          </Link>

          <Link href="/kanban" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
            }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#333',
                margin: '0 0 8px 0',
              }}>
                Kanban Board
              </h2>
              <p style={{
                fontSize: 14,
                color: '#666',
                margin: 0,
              }}>
                Track tasks and workflow progress
              </p>
            </div>
          </Link>

          <Link href="/approvals" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
            }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#333',
                margin: '0 0 8px 0',
              }}>
                Approvals
              </h2>
              <p style={{
                fontSize: 14,
                color: '#666',
                margin: 0,
              }}>
                Decision gates and approval workflows
              </p>
            </div>
          </Link>

          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
            }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>📰</div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#333',
                margin: '0 0 8px 0',
              }}>
                Activity Feed
              </h2>
              <p style={{
                fontSize: 14,
                color: '#666',
                margin: 0,
              }}>
                Real-time updates and event logs
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
