import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Check Email | MOOD MNKY",
  description: "Check your email for verification",
}

interface Props {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckEmailPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  const type = typeof params.type === 'string' ? params.type : 'verification'

  const titles = {
    verification: "Check your email",
    reset: "Check your email",
  }

  const descriptions = {
    verification: "We sent you a verification link. Please check your email to verify your account.",
    reset: "We sent you a password reset link. Please check your email to reset your password.",
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{titles[type as keyof typeof titles]}</CardTitle>
          <CardDescription>
            {descriptions[type as keyof typeof descriptions]}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
} 