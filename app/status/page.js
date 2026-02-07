'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

export default function StatusPage() {
  const [status, setStatus] = useState({ loading: true })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const supabase = createClient()
        
        // Check if client initialized
        const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
        const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        // Try to make a simple query
        const { error } = await supabase.auth.getSession()
        
        setStatus({
          loading: false,
          envConfigured: hasUrl && hasKey,
          supabaseConnected: !error,
          error: error?.message || null
        })
      } catch (err) {
        setStatus({
          loading: false,
          envConfigured: false,
          supabaseConnected: false,
          error: err.message
        })
      }
    }
    
    checkStatus()
  }, [])

  if (status.loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div>Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">System Status</h1>
        
        <div className="space-y-4">
          <div className={`p-4 rounded ${status.envConfigured ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <div className="font-semibold mb-2">Environment Variables</div>
            <div>{status.envConfigured ? '✅ Configured' : '❌ Missing'}</div>
          </div>
          
          <div className={`p-4 rounded ${status.supabaseConnected ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <div className="font-semibold mb-2">Supabase Connection</div>
            <div>{status.supabaseConnected ? '✅ Connected' : '❌ Failed'}</div>
            {status.error && (
              <div className="mt-2 text-sm text-red-300">Error: {status.error}</div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <a href="/login" className="text-cyan-400 hover:text-cyan-300">
            → Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
