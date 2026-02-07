import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // Create the redirect response FIRST
    const response = NextResponse.redirect(new URL('/', request.url))

    // Create Supabase client INLINE — write cookies directly to the response object
    // (not via the shared createClient() helper, which uses cookies() from next/headers)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response // Session cookies are ON this response
    }
  }

  return NextResponse.redirect(new URL('/login?error=1', request.url))
}
