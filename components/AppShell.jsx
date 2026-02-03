"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSupabase } from '../lib/supabaseClient'
export default function AppShell({ children }) {
  const [open, setOpen] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  useEffect(() => {
    const s = getSupabase()
    if (!s) return
    s.auth.getSession().then(({ data }) => setUserEmail(data.session?.user?.email || null))
  }, [])
  const signOut = async () => {
    const s = getSupabase(); if (!s) return; await s.auth.signOut(); window.location.href = '/login'
  }
  return (
    <div className="shell-root" data-theme="dark">
      <header className="topbar">
        <button className="hamb" aria-label="menu" onClick={() => setOpen(true)}>☰</button>
        <div className="brand">Ops Workspace</div>
        <div style={{ marginLeft: 'auto' }} className="top-actions">{userEmail ? <span className="user">{userEmail} <button onClick={signOut} className="link-btn">Sign out</button></span> : <Link href="/login">Sign in</Link>}</div>
      </header>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/approvals">Approvals</Link>
          <Link href="/kanban">Kanban</Link>
          <Link href="/feed">Feed</Link>
        </nav>
        <div className="sidebar-foot">{userEmail || 'Not signed in'}</div>
      </aside>
      <div className={`drawer-backdrop ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <main className="main">{children}</main>
      <style jsx>{`
        .topbar{height:56px;display:flex;align-items:center;gap:12px;padding:0 16px;background:var(--panel);border-bottom:1px solid var(--border)}
        .brand{font-weight:700}
        .hamb{display:none}
        .sidebar{width:240px;position:fixed;left:0;top:56px;bottom:0;padding:16px;background:var(--panel);border-right:1px solid var(--border);overflow:auto}
        .main{margin-left:240px;padding:20px}
        .drawer-backdrop{display:none}
        @media(max-width:720px){.hamb{display:inline-block}.sidebar{position:fixed;left:-320px;transition:left .2s}.sidebar.open{left:0}.main{margin-left:0;padding:12px}.drawer-backdrop{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.4);opacity:0;pointer-events:none}.drawer-backdrop.show{opacity:1;pointer-events:auto}}
      `}</style>
    </div>
  )
}
