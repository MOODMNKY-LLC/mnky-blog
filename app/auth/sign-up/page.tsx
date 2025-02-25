import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | MOOD MNKY",
  description: "Create your MOOD MNKY account",
}

interface PageProps {
  searchParams: Promise<{ 
    error?: string; 
    redirect?: string;
    email?: string;
  }>
}

export default async function SignUpPage({
  searchParams,
}: PageProps) {
  // Await the searchParams
  const params = await searchParams
  const redirectPath = params.redirect || "/dashboard"

  const supabase = await createClient()

  // Check if user is already signed in
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (user && !userError) {
    return redirect(redirectPath)
  }

  return (
    <SignUpForm 
      redirect={params.redirect} 
      email={params.email} 
    />
  )
} 