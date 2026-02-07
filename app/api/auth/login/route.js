import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    console.log('[Login API] Authenticating:', email)
    
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.log('[Login API] Auth error:', error.message)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.log('[Login API] Login successful:', data.user.email)
    
    // Return success - cookies are already set by createClient
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('[Login API] Exception:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
