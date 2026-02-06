import { createClient } from '@supabase/supabase-js'

export async function GET(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .order('date', { ascending: false })
      .limit(10)

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
      .from('briefs')
      .insert([
        {
          date: body.date || new Date().toISOString().split('T')[0],
          title: body.title,
          priorities: body.priorities || [],
          opportunities: body.opportunities || [],
          blockers: body.blockers || [],
          context: body.context,
        },
      ])
      .select()

    if (error) throw error
    return Response.json(data[0])
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
