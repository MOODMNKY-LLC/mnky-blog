import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sign In | MOOD MNKY",
  description: "Sign in to your MOOD MNKY account",
}

interface PageProps {
  searchParams: Promise<{ 
    error?: string; 
    redirect?: string;
    email?: string;
  }>
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
    const redirectTo = formData.get("redirect") as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Check if the error is due to invalid credentials
      if (error.message.includes("Invalid login credentials")) {
        // Check if the email exists by attempting to reset password
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
        
        // If we get an error, the email doesn't exist
        if (resetError) {
          const searchParams = new URLSearchParams({
            error: "New to MOOD MNKY? We'd love to have you join our creative community! ✨",
            email: email,
            ...(redirectTo && { redirect: redirectTo }),
          })
          return redirect(`/auth/sign-in?${searchParams.toString()}`)
        }
      }
      const searchParams = new URLSearchParams({
        error: "Incorrect password. Try again or reset it below.",
        ...(redirectTo && { redirect: redirectTo }),
      })
      return redirect(`/auth/sign-in?${searchParams.toString()}`)
    }

    return redirect(redirectTo || redirectPath)
  }

  // Check if user is already signed in
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (user && !userError) {
    return redirect(redirectPath)
  }

  return (
    <form action={signIn} className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#F7B32B]">Welcome back</h1>
        <p className="text-sm text-zinc-500">Enter your email to sign in to your account</p>
      </div>

      {params.error && (
        <Alert 
          className={cn(
            "border-none rounded-lg",
            params.error.includes("New to MOOD MNKY?") 
              ? "bg-[#F7B32B]/5 text-[#F7B32B]" 
              : "bg-red-500/5 text-red-400 border border-red-500/10"
          )}
        >
          <div className="flex gap-3">
            {params.error.includes("New to MOOD MNKY?") ? (
              <RocketIcon className="h-5 w-5 text-[#F7B32B]" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            )}
            <AlertDescription className="flex-1 text-sm">
              {params.error}
              {params.error.includes("New to MOOD MNKY?") && (
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#F7B32B]/10 bg-[#F7B32B]/5 hover:bg-[#F7B32B]/10 hover:text-[#F7B32B] transition-colors"
                    asChild
                  >
                    <Link href={`/auth/sign-up?${new URLSearchParams({
                      ...(params.email && { email: params.email }),
                      ...(params.redirect && { redirect: params.redirect }),
                    }).toString()}`}>
                      Join Now
                    </Link>
                  </Button>
                  <span className="text-sm text-zinc-500">
                    Takes less than a minute
                  </span>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-200">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F7B32B]/50 focus:ring-[#F7B32B]/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-200">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F7B32B]/50 focus:ring-[#F7B32B]/5"
          />
        </div>

        <div className="flex justify-end">
          <Link
            href={`/auth/forgot-password${params.redirect ? `?redirect=${encodeURIComponent(params.redirect)}` : ''}`}
            className="text-sm text-zinc-400 hover:text-[#F7B32B]"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-black font-medium transition-colors"
        >
          Sign in
        </Button>
      </div>

      {params.redirect && (
        <input type="hidden" name="redirect" value={params.redirect} />
      )}

      <div className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/sign-up${params.redirect ? `?redirect=${encodeURIComponent(params.redirect)}` : ''}`}
          className="text-[#F7B32B] hover:text-[#F7B32B]/80 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  )
} 