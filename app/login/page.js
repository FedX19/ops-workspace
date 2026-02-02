'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
export default function Login(){
  const [email,setEmail]=useState('')
  const [sent,setSent]=useState(false)
  const submit=async (e)=>{
    e.preventDefault();
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }
  return (<div style={{padding:20}}>
    <h2>Sign in</h2>
    {!sent? (
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <button type="submit">Send magic link</button>
      </form>
    ):(<p>Check your email for a magic link.</p>)}
  </div>)
}
