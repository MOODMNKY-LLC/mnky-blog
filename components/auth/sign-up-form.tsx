"use client"

import { useState } from "react"
import Link from "next/link"
import { signUp } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom"
import { Icons } from "@/components/ui/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-black font-medium transition-colors"
      disabled={pending}
    >
      {pending ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : "Create account"
      }
    </Button>
  )
}

const inputClasses = "border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F7B32B]/50 focus:ring-[#F7B32B]/5"

export function SignUpForm({ redirect, email }: { redirect?: string; email?: string }) {
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError(null)

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    // Submit the form programmatically
    signUp(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#F7B32B]">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Enter your details to get started
        </p>
      </div>
      
      {(error || passwordError) && (
        <Alert variant="destructive" className="border-red-500/20 bg-red-900/10">
          <AlertDescription>{passwordError || error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="text-zinc-200">
            Full Name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="John Doe"
            className={inputClasses}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-zinc-200">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={email}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-zinc-200">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className={inputClasses}
          />
        </div>

        <div>
          <Label htmlFor="confirm_password" className="text-zinc-200">
            Confirm Password
          </Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            placeholder="••••••••"
            className={inputClasses}
          />
        </div>

        <input type="hidden" name="redirect" value={redirect} />
      </div>

      <SubmitButton />

      <div className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href={`/auth/sign-in${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-[#F7B32B] hover:text-[#F7B32B]/80 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  )
} 