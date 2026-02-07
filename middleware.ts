import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('[Middleware] Request path:', request.nextUrl.pathname)
  console.log('[Middleware] Cookies:', request.cookies.getAll().map(c => c.name))
  
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll()
          console.log('[Server Cookie GetAll]', cookies.length, 'cookies')
          return cookies
        },
        setAll(cookiesToSet) {
          console.log('[Server Cookie SetAll]', cookiesToSet.length, 'cookies')
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  
  console.log('[Middleware] User:', user?.email || 'none', 'Error:', error?.message || 'none')

  // Public routes
  const publicPaths = ['/login', '/status']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Protect all routes except public ones
  if (!user && !isPublicPath) {
    console.log('[Middleware] No user, redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from /login
  if (user && request.nextUrl.pathname === '/login') {
    console.log('[Middleware] User logged in, redirecting to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('[Middleware] Allowing request')
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
