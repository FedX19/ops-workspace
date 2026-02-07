import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { access_token, refresh_token } = await request.json()
    
    console.log('[Session API] Setting session on server')
    
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    
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
