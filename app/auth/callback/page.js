"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "../../../lib/supabaseClient"
export default function CallbackPage(){
  const router = useRouter()
  useEffect(()=>{
    async function run(){
      const supabase = getSupabase()
      if(!supabase){
        router.replace('/login?error=1')
        return
      }
      try{
        const url = window.location.href
        const { error } = await supabase.auth.exchangeCodeForSession(url)
        if(error) {
          console.error('exchangeCodeForSession error', error)
          router.replace('/login?error=1')
        } else {
          router.replace('/')
        }
      }catch(e){
        console.error(e)
        router.replace('/login?error=1')
      }
    }
    run()
  },[])
  return (<div style={{padding:20}}>Signing you in…</div>)
}
