import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  // IMPORTANT: Always use getUser() to validate the token
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    // Redirect to sign in page and store the current URL to redirect back
    const redirectUrl = new URL('/auth/sign-in', 'http://localhost:3000')
    redirectUrl.searchParams.set('redirect', '/private')
    redirect(redirectUrl.toString())
  }

  return (
    <div className="flex-1 flex flex-col gap-6 items-center justify-center p-4 md:p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to Your Private Page
        </h1>
        <p className="text-sm text-muted-foreground">
          This page is only accessible to authenticated users.
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium">Your Account Details</h2>
          <div className="mt-2 space-y-1 text-sm">
            <p>Email: {user.email}</p>
            <p>Last Sign In: {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 