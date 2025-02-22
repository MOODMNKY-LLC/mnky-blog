import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Sign In | MOOD MNKY",
  description: "Sign in to your MOOD MNKY account",
}

interface PageProps {
  searchParams: Promise<{ error?: string; redirect?: string }>
}

export default async function SignInPage({
  searchParams,
}: PageProps) {
  // Await the searchParams
  const params = await searchParams
  const redirectPath = params.redirect || "/dashboard"

  const supabase = await createClient()

  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect("/auth/sign-in?error=Invalid email or password")
    }

    return redirect(redirectPath)
  }

  // Check if user is already signed in
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (user && !userError) {
    return redirect(redirectPath)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>

      <form action={signIn}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </>
  )
} 