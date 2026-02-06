import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 400 })
    }

    return Response.json({ 
      success: true, 
      session: data.session,
      user: data.user 
    })
  } catch (err) {
    return Response.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 })
  }
}
