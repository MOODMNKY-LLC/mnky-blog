import { createClient } from "@/utils/supabase/server"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { LogOut, Settings } from "lucide-react"
import { signOut } from "@/app/actions"

export async function AuthHeaderMobile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Button variant="ghost" asChild className="w-full justify-start">
          <Link href="/auth/sign-in" className="px-4">Sign In</Link>
        </Button>
        <Button asChild className="w-full justify-start">
          <Link href="/auth/sign-up" className="px-4">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 py-2 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.user_metadata.avatar_url} 
            alt={user.user_metadata.full_name} 
          />
          <AvatarFallback>
            {user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">
            {user.user_metadata.full_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/profile"
        className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </form>
    </div>
  )
} 