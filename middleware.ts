import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('[MIDDLEWARE] Running for path:', pathname)
  
  const incomingCookies = request.cookies.getAll()
  console.log('[MIDDLEWARE] Incoming cookies:', incomingCookies.map(c => c.name).join(', '))
  
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          console.log('[MIDDLEWARE] Setting cookies on both request and response:', cookiesToSet.map(c => c.name).join(', '))
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  console.log('[MIDDLEWARE] getUser() returned:', {
    hasUser: !!user,
    email: user?.email,
  })

  const publicPaths = ['/login', '/status', '/auth/callback']
  const isPublicPath = publicPaths.includes(pathname)

  if (!user && !isPublicPath) {
    console.log('[MIDDLEWARE] No user and not a public path, redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && pathname === '/login') {
    console.log('[MIDDLEWARE] User logged in but on /login, redirecting to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('[MIDDLEWARE] Passing through')
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
