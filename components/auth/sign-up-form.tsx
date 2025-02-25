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

export function SignUpForm({ redirect, email }: { redirect?: string; email?: string }) {
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <form action={signUp} className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#F7B32B]">Create an account</h1>
        <p className="text-sm text-zinc-500">Enter your email below to create your account</p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/20 text-red-400 bg-red-900/10">
          <Icons.warning className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
            defaultValue={email}
            required
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F7B32B]/50 focus:ring-[#F7B32B]/5"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-zinc-200">Password</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-zinc-400 hover:text-[#F7B32B] hover:bg-[#F7B32B]/5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Icons.eyeOff className="h-4 w-4" />
              ) : (
                <Icons.eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={8}
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F7B32B]/50 focus:ring-[#F7B32B]/5"
          />
        </div>

        <SubmitButton />
      </div>

      {redirect && (
        <input type="hidden" name="redirect" value={redirect} />
      )}

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