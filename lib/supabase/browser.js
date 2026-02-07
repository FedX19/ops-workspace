'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name, value, options) {
          document.cookie = `${name}=${value}; path=/; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.sameSite ? `samesite=${options.sameSite};` : ''}`
        },
        remove(name, options) {
          document.cookie = `${name}=; path=/; max-age=0`
        },
      },
    }
  )
}
