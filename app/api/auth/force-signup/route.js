import { createClient } from '@supabase/supabase-js'

// Emergency signup endpoint for admin
export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    console.log('Force signup attempt:', { email })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // First, try to delete existing user if any
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existing = existingUsers?.users?.find(u => u.email === email)
      if (existing) {
        console.log('Found existing user, will sign in instead')
      }
    } catch (err) {
      console.log('Could not check existing users:', err.message)
    }

    // Try signup
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // No email confirmation
      }
    })

    console.log('SignUp result:', { data: signUpData, error: signUpError })

    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError
    }

    // Now sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('SignIn result:', { data: signInData, error: signInError })

    if (signInError) {
      return Response.json({
        success: false,
        error: signInError.message,
        step: 'signin',
        details: signInError
      }, { status: 400 })
    }

    return Response.json({
      success: true,
      message: 'Account created and signed in',
      session: signInData.session,
      user: signInData.user
    })
  } catch (err) {
    console.error('Force signup error:', err)
    return Response.json({
      success: false,
      error: err.message,
      details: err
    }, { status: 500 })
  }
}
