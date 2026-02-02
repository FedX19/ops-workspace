'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
export default function Home(){
  const [user,setUser]=useState(null)
  useEffect(()=>{
    supabase.auth.getSession().then(({ data })=> setUser(data.session?.user || null))
  },[])
  if(!user) return (<div style={{padding:20}}>Checking auth... <br/><Link href="/login">Login</Link></div>)
  return (<div style={{padding:20}}>
    <h1>Ops Workspace</h1>
    <p>Signed in as: {user.email}</p>
    <ul>
      <li><Link href="/approvals">Approvals</Link></li>
      <li><Link href="/kanban">Kanban</Link></li>
      <li><Link href="/feed">Feed</Link></li>
    </ul>
  </div>)
}
