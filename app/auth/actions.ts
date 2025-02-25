"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { createClient } from "@/utils/supabase/server"

export async function signUp(formData: FormData) {
  const headersList = await (headers() as unknown as Promise<ReadonlyHeaders>)
  const origin = headersList.get('origin') || ''
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string

  const supabase = await createClient()

  const callbackUrl = new URL('/auth/callback', origin)
  if (redirectTo) {
    callbackUrl.searchParams.set('redirect', redirectTo)
  }

  // Sign up the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl.toString(),
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