"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"

export default function CallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    async function run() {
      const supabase = createClient()
      
      try {
        const url = window.location.href
        const { error } = await supabase.auth.exchangeCodeForSession(url)
        if (error) {
          console.error('exchangeCodeForSession error', error)
          router.replace('/login?error=1')
        } else {
          router.replace('/')
        }
      } catch (e) {
        console.error(e)
        router.replace('/login?error=1')
      }
    }
    run()
  }, [router])
  
  return (
    <div style={{ padding: 20 }}>
      Signing you in…
    </div>
  )
}
