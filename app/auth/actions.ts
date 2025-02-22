"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { createClient } from "@/utils/supabase/server"

export async function signUp(formData: FormData) {
  const headersList = await (headers() as unknown as Promise<ReadonlyHeaders>)
  const origin = headersList.get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string
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
    return redirect("/auth/sign-up?error=Could not create account")
  }

  return redirect("/auth/verify-email")
} 