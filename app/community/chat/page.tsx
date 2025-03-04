'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Bot, Hash, ArrowRight } from "lucide-react"
import Link from "next/link"
import { InitializeChannelsButton } from '@/components/community/chat/initialize-channels-button'
import { CheckRolesButton } from '@/components/community/chat/check-roles-button'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const cookieStore = cookies() as unknown as RequestCookies
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) redirect('/login')

  // Redirect to the general channel by default
  redirect('/community/chat/general')
} 