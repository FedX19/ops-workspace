'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          if (typeof document === 'undefined') return undefined
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
          return value
        },
        set(name, value, options) {
          if (typeof document === 'undefined') return
          const optionsObj = options || {}
          const cookieString = [
            `${name}=${value}`,
            `path=/`,
            `max-age=${optionsObj.maxAge || 31536000}`,
            optionsObj.domain ? `domain=${optionsObj.domain}` : '',
            optionsObj.secure ? 'secure' : '',
            optionsObj.sameSite ? `samesite=${optionsObj.sameSite}` : 'samesite=lax',
          ]
            .filter(Boolean)
            .join('; ')
          document.cookie = cookieString
        },
        remove(name, options) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
        },
      },
    }
  )
}
