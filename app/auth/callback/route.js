import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// This is the magic link callback endpoint
// Flow: User clicks magic link → browser goes to /auth/callback?code=XXX
// → This handler exchanges code for session → redirects to / with session cookies
//
// KEY INSIGHT: The response object must have cookies set BEFORE returning
// Otherwise the browser won't receive the Set-Cookie headers

export async function GET(request) {
  console.log('[AUTH CALLBACK] Hit /auth/callback')
  console.log('[AUTH CALLBACK] Full URL:', request.url)
  
  const url = new URL(request.url)
  console.log('[AUTH CALLBACK] Search params:', url.search)
  
  const { searchParams } = url
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  
  // Check for Supabase error parameters
  if (error) {
    console.error('[AUTH CALLBACK] ⚠️  Supabase returned error:', {
      error,
      error_description,
    })
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url))
  }
  
  console.log('[AUTH CALLBACK] Code present:', !!code)
  if (code) {
    console.log('[AUTH CALLBACK] Code value:', code.substring(0, 20) + '...')
    console.log('[AUTH CALLBACK] Code length:', code.length)
  } else {
    console.warn('[AUTH CALLBACK] ⚠️  No code parameter found in URL')
  }

  if (code) {
    // Create the redirect response FIRST
    const response = NextResponse.redirect(new URL('/', request.url))
    console.log('[AUTH CALLBACK] Created redirect response to /')

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('[AUTH CALLBACK] ❌ CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not configured!')
      return NextResponse.redirect(new URL('/login?error=config', request.url))
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[AUTH CALLBACK] ❌ CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured!')
      return NextResponse.redirect(new URL('/login?error=config', request.url))
    }

    // Create Supabase client INLINE — write cookies directly to the response object
    // (not via the shared createClient() helper, which uses cookies() from next/headers)
    console.log('[AUTH CALLBACK] Creating Supabase client with:')
    console.log('[AUTH CALLBACK] - URL:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...')
    console.log('[AUTH CALLBACK] - Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...')
    
    let setAllCalled = false
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const all = request.cookies.getAll()
            console.log('[AUTH CALLBACK] getAll() called - returning', all.length, 'cookies from request')
            return all
          },
          setAll(cookiesToSet) {
            setAllCalled = true
            console.log('[AUTH CALLBACK] *** setAll() CALLED with', cookiesToSet.length, 'cookies ***')
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('[AUTH CALLBACK] Setting cookie:', name, '= ...', '| Path:', options?.path, '| SameSite:', options?.sameSite, '| Secure:', options?.secure, '| HttpOnly:', options?.httpOnly)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    
    console.log('[AUTH CALLBACK] Supabase client created, about to call exchangeCodeForSession')

    console.log('[AUTH CALLBACK] Calling exchangeCodeForSession...')
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('[AUTH CALLBACK] exchangeCodeForSession response:', {
      hasError: !!error,
      errorMessage: error?.message,
      errorCode: error?.code,
      hasSession: !!data?.session,
      user: data?.user?.email,
      setAllWasCalled: setAllCalled,
    })
    
    if (error) {
      console.error('[AUTH CALLBACK] ❌ EXCHANGE FAILED:', {
        message: error.message,
        code: error.code,
        status: error.status,
        setAllWasCalled: setAllCalled,
      })
      return NextResponse.redirect(new URL('/login?error=1', request.url))
    }
    
    if (!setAllCalled) {
      console.error('[AUTH CALLBACK] ⚠️  WARNING: setAll() was NOT called! Cookies may not be set properly')
    }
    
    console.log('[AUTH CALLBACK] ✅ SUCCESS - Session established for:', data?.user?.email)
    console.log('[AUTH CALLBACK] - Session expires at:', data?.session?.expires_at)
    console.log('[AUTH CALLBACK] - Session user ID:', data?.user?.id)
    console.log('[AUTH CALLBACK] - setAll() was called:', setAllCalled)
    
    // Debug: Log the response headers to verify cookies are being set
    const setCookieHeaders = response.headers.getSetCookie()
    console.log('[AUTH CALLBACK] - Response has', setCookieHeaders.length, 'Set-Cookie headers')
    setCookieHeaders.forEach((cookie, i) => {
      console.log('[AUTH CALLBACK] - Cookie', i + ':', cookie.substring(0, 80) + '...')
    })
    
    console.log('[AUTH CALLBACK] - About to return redirect response to /')
    return response // Session cookies are ON this response
  }

  console.log('[AUTH CALLBACK] No code provided, redirecting to /login?error=1')
  return NextResponse.redirect(new URL('/login?error=1', request.url))
}
