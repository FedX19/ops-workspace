import { createClient } from '@supabase/supabase-js'

// This endpoint manually confirms a user's email
// Only works for whitelisted emails
const ALLOWED_EMAILS = [
  'federowt@gmail.com',
  'tim@tmfholdings.com',
]

export async function POST(req) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || !ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      return Response.json({ error: 'Email not authorized' }, { status: 403 })
    }

    // Use service role key to confirm user
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Get the user by email
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (fetchError) throw fetchError

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return Response.json({ error: 'User not found. Sign up first.' }, { status: 404 })
    }

    // Confirm the user's email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirmed_at: new Date().toISOString() }
    )

    if (updateError) throw updateError

    return Response.json({ 
      success: true, 
      message: `User ${email} confirmed. You can now sign in.` 
    })
  } catch (err) {
    console.error('Confirm user error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
