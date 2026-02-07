import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { access_token, refresh_token } = await request.json()
    
    console.log('[Session API] Setting session on server')
    
    const supabase = await createClient()
    
    // Set the session on the server
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })
    
    if (error) {
      console.error('[Session API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    console.log('[Session API] Session set successfully for:', data.user?.email)
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Session API] Exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
