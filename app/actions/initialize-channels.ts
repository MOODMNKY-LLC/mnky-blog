'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

export async function initializeDefaultChannels() {
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

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  // Create default channels
  const defaultChannels = [
    {
      name: 'general',
      description: 'General discussion channel',
      slug: 'general',
      type: 'public',
      created_by: user.id
    },
    {
      name: 'announcements',
      description: 'Important announcements and updates',
      slug: 'announcements',
      type: 'public',
      created_by: user.id
    },
    {
      name: 'introductions',
      description: 'Introduce yourself to the community',
      slug: 'introductions',
      type: 'public',
      created_by: user.id
    }
  ]

  for (const channel of defaultChannels) {
    const { error: insertError } = await supabase
      .from('channels')
      .upsert(channel, { onConflict: 'slug' })

    if (insertError) {
      console.error(`Error creating channel ${channel.name}:`, insertError)
    }
  }

  return { success: true }
} 