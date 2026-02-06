import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_EMAILS = [
  'federowt@gmail.com',
  'tim@tmfholdings.com',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/auth/callback') || 
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/admin') ||
      pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.startsWith('/logo') || 
      pathname.startsWith('/manifest')) {
    return NextResponse.next()
  }

  // Check auth cookie
  const supabaseAuthToken = request.cookies.get('sb-access-token') || request.cookies.get('sb-jmnuegkkzozshhvfkjnc-auth-token')
  
  if (!supabaseAuthToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
