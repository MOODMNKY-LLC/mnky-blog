import { Metadata } from "next"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Complete Profile | MOOD MNKY",
  description: "Complete your profile information",
}

export default async function CompleteProfilePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return redirect("/auth/sign-in")
  }

  const updateProfile = async (formData: FormData) => {
    "use server"

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return redirect("/auth/sign-in")
    }

    const username = formData.get("username") as string
    const fullName = formData.get("full_name") as string
    const website = formData.get("website") as string
    const bio = formData.get("bio") as string

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        full_name: fullName,
        website,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return redirect("/auth/complete-profile?error=Could not update profile")
    }

    return redirect("/dashboard")
  }

  // Get current profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", session.user.id)
    .single()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete your profile</CardTitle>
          <CardDescription>
            Add more information to your profile
          </CardDescription>
        </CardHeader>
        <form action={updateProfile}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={profile?.username}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={profile?.website}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio}
                className="resize-none"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Update profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 