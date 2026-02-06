import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance
  
  if (typeof window === 'undefined') return null
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars')
    return null
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-ops-auth',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  console.log('Supabase client initialized')
  return supabaseInstance
}

export const supabase = getSupabase()
