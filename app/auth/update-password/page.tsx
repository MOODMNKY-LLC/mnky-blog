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

export const metadata: Metadata = {
  title: "Update Password | MOOD MNKY",
  description: "Set your new password",
}

export default async function UpdatePasswordPage() {
  const supabase = await createClient()

  const updatePassword = async (formData: FormData) => {
    "use server"

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (password !== confirmPassword) {
      return redirect("/auth/update-password?error=Passwords do not match")
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return redirect("/auth/update-password?error=Could not update password")
    }

    return redirect("/auth/sign-in?message=Password updated successfully")
  }

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return redirect("/auth/sign-in")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Update password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <form action={updatePassword}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                name="confirm_password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Update password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 