import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request) {
  console.log('[AUTH CALLBACK] Hit /auth/callback')
  
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  console.log('[AUTH CALLBACK] Code present:', !!code)
  if (code) {
    console.log('[AUTH CALLBACK] Code value:', code.substring(0, 20) + '...')
  }

  if (code) {
    // Create the redirect response FIRST
    const response = NextResponse.redirect(new URL('/', request.url))
    console.log('[AUTH CALLBACK] Created redirect response to /')

    // Create Supabase client INLINE — write cookies directly to the response object
    // (not via the shared createClient() helper, which uses cookies() from next/headers)
    console.log('[AUTH CALLBACK] Creating Supabase client with:')
    console.log('[AUTH CALLBACK] - URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...')
    console.log('[AUTH CALLBACK] - Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const all = request.cookies.getAll()
            console.log('[AUTH CALLBACK] Getting cookies from request:', all.length, 'cookies')
            return all
          },
          setAll(cookiesToSet) {
            console.log('[AUTH CALLBACK] Setting', cookiesToSet.length, 'cookies on response')
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('[AUTH CALLBACK] Setting cookie:', name, '| Path:', options?.path, '| SameSite:', options?.sameSite)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    console.log('[AUTH CALLBACK] Calling exchangeCodeForSession...')
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('[AUTH CALLBACK] exchangeCodeForSession response:', {
      hasError: !!error,
      errorMessage: error?.message,
      errorCode: error?.code,
      hasSession: !!data?.session,
      user: data?.user?.email,
    })
    
    if (error) {
      console.error('[AUTH CALLBACK] ERROR DETAILS:', {
        message: error.message,
        code: error.code,
        status: error.status,
      })
      return NextResponse.redirect(new URL('/login?error=1', request.url))
    }
    
    console.log('[AUTH CALLBACK] SUCCESS - Session established for:', data?.user?.email)
    console.log('[AUTH CALLBACK] Session expires at:', data?.session?.expires_at)
    console.log('[AUTH CALLBACK] Returning redirect response with cookies')
    console.log('[AUTH CALLBACK] Response cookie count:', Object.keys(response.cookies).length)
    return response // Session cookies are ON this response
  }

  console.log('[AUTH CALLBACK] No code provided, redirecting to /login?error=1')
  return NextResponse.redirect(new URL('/login?error=1', request.url))
}
