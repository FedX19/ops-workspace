'use server'

import { createClient } from '@/lib/supabase/server'

export async function login(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  console.log('[Server Action] Login attempt for:', email)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log('[Server Action] Auth error:', error.message)
      return { success: false, error: error.message }
    }

    console.log('[Server Action] Login successful for:', data.user?.email)
    return { success: true }
  } catch (err) {
    console.error('[Server Action] Exception:', err)
    return { success: false, error: err.message }
  }
}
