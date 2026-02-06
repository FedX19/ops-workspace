import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function GET(req) {
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
