'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const searchParams = new URLSearchParams({
      error: error.message,
      ...(redirectTo && { redirect: redirectTo }),
    })
    return redirect(`/auth/sign-in?${searchParams.toString()}`)
  }

  return redirect(redirectTo || '/dashboard')
}

export async function signUp(formData: FormData) {
  const headersList = await (headers() as unknown as Promise<ReadonlyHeaders>)
  const origin = headersList.get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const fullName = formData.get('full_name') as string
  const redirectTo = formData.get('redirect') as string
  const supabase = await createClient()

  // Check if username is already taken
  const { data: existingUser, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    const searchParams = new URLSearchParams({
      error: 'This username is already taken. Please choose another one.',
      ...(redirectTo && { redirect: redirectTo }),
    })
    return redirect(`/auth/sign-up?${searchParams.toString()}`)
  }

  const callbackParams = new URLSearchParams()
  if (redirectTo) {
    callbackParams.set('redirect', redirectTo)
  }
  const callbackUrl = `${origin}/auth/callback${callbackParams.toString() ? `?${callbackParams.toString()}` : ''}`

  // Sign up the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl,
      data: {
        username,
        full_name: fullName,
        // Set initial preferences
        preferences: {
          theme: {
            mode: 'dark',
            color: 'amber',
            font: 'inter',
            reduce_animations: false,
            enable_sounds: true
          },
          notifications: {
            email: true,
            push: true,
            chat: true,
            forum: true,
            mentions: true,
            blog_comments: true,
            blog_mentions: true,
            new_posts_in_series: true,
            digest: {
              enabled: true,
              frequency: 'weekly',
              categories: ['blog', 'forum', 'chat']
            }
          },
          privacy: {
            show_online_status: true,
            show_activity: true,
            allow_mentions: true,
            show_email: false,
            show_social: true,
            profile_visibility: 'public',
            activity_visibility: 'followers',
            allow_direct_messages: 'authenticated'
          },
          agent: {
            name: 'MNKY Assistant',
            personality_traits: ['Professional', 'Friendly', 'Creative'],
            primary_role: 'Writing Assistant',
            expertise_areas: ['Technology', 'Creative Writing'],
            interaction_style: {
              formality: 'casual',
              tone: 'friendly',
              humor_level: 'moderate',
              emoji_usage: 'occasional',
              verbosity: 'concise'
            }
          }
        }
      },
    },
  })

  if (error) {
    const searchParams = new URLSearchParams({
      error: error.message,
      ...(redirectTo && { redirect: redirectTo }),
    })
    return redirect(`/auth/sign-up?${searchParams.toString()}`)
  }

  return redirect('/auth/verify-email')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/')
}

export async function resetPassword(formData: FormData) {
  const headersList = await (headers() as unknown as Promise<ReadonlyHeaders>)
  const origin = headersList.get('origin')
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    return redirect('/auth/forgot-password?error=' + encodeURIComponent(error.message))
  }

  return redirect('/auth/verify-email?type=recovery')
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return redirect('/auth/reset-password?error=' + encodeURIComponent(error.message))
  }

  return redirect('/auth/sign-in?message=Password updated successfully')
} 