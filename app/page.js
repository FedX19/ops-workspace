import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">Ops Workspace</h1>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/briefs"
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Daily Briefs</h2>
            <p className="text-gray-400">Interactive daily briefings</p>
          </Link>

          <Link
            href="/kanban"
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Kanban Board</h2>
            <p className="text-gray-400">Task management</p>
          </Link>

          <Link
            href="/approvals"
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Approvals</h2>
            <p className="text-gray-400">Review pending requests</p>
          </Link>

          <Link
            href="/feed"
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Activity Feed</h2>
            <p className="text-gray-400">Recent updates</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
