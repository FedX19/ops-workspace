import { createClient } from '@supabase/supabase-js'

export async function GET(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('kanban_cards')
      .select('*')
      .order('ordering', { ascending: true })

    if (error) throw error
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('kanban_cards')
      .insert([{
        column_id: body.column_id,
        title: body.title,
        body: body.body || null,
        owner: body.owner || null,
        ordering: body.ordering || 0,
      }])
      .select()

    if (error) throw error
    return Response.json(data[0])
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
