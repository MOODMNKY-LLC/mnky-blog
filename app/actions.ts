'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/auth/sign-in?error=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const headersList = await (headers() as unknown as Promise<ReadonlyHeaders>)
  const origin = headersList.get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const fullName = formData.get('full_name') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username,
        full_name: fullName,
      },
    },
  })

  if (error) {
    return redirect('/auth/sign-up?error=' + encodeURIComponent(error.message))
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