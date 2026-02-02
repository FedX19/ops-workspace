'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '../../lib/supabaseClient'
export default function Login(){
  const [email,setEmail]=useState('')
  const [sent,setSent]=useState(false)
  const [supabaseAvailable,setSupabaseAvailable]=useState(true)
  useEffect(()=>{
    const s = getSupabase()
    setSupabaseAvailable(!!s)
  },[])
  const submit=async (e)=>{
    e.preventDefault();
    const supabase = getSupabase()
    if(!supabase) return
    const redirectTo = typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined
    await supabase.auth.signInWithOtp({ email }, { redirectTo })
    setSent(true)
  }
  if(!supabaseAvailable) return (<div style={{padding:20}}>Supabase env vars not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</div>)
  return (<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
    <div style={{maxWidth:960,display:'flex',width:'100%',gap:24}}>
      <div style={{flex:1,padding:24,boxShadow:'0 4px 14px rgba(2,6,23,0.08)',borderRadius:12,background:'#fff'}}>
        <div style={{marginBottom:12,fontWeight:700,fontSize:18}}>Ops Workspace</div>
        <h2 style={{margin:'8px 0'}}>Sign in to your org</h2>
        <p style={{color:'#6b7280'}}>Use magic link to sign in quickly on mobile.</p>
        {!sent? (
          <form onSubmit={submit} style={{marginTop:12,display:'flex',gap:8}}>
            <input aria-label="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e5e7eb'}} />
            <button type="submit" style={{padding:'10px 14px',borderRadius:8,background:'#2563eb',color:'#fff',border:'none',fontWeight:700}}>Send magic link</button>
          </form>
        ):(<p style={{marginTop:12}}>Check your email for a magic link.</p>)}
      </div>
      <div style={{width:280,padding:20,borderRadius:12,background:'linear-gradient(180deg,#f8fafc,#eef2ff)'}}>
        <div style={{fontWeight:700,marginBottom:8}}>What you get</div>
        <ul style={{paddingLeft:16,color:'#374151'}}>
          <li>Approvals — quick decision flows</li>
          <li>Kanban — track tasks visually</li>
          <li>Feed — audit & activity history</li>
        </ul>
      </div>
    </div>
  </div>)
}
