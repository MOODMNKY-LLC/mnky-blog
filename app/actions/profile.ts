'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").optional().nullable(),
  full_name: z.string().min(2, "Full name must be at least 2 characters.").optional().nullable(),
  display_name: z.string().min(2, "Display name must be at least 2 characters.").optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  website: z.string().url("Please enter a valid URL").optional().nullable(),
  bio: z.string().max(160, "Bio must be less than 160 characters.").optional().nullable(),
  pronouns: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  locale: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  interests: z.array(z.string()).optional().nullable(),
  expertise: z.array(z.string()).optional().nullable(),
  mood_status: z.string().optional().nullable(),
  availability_status: z.string().optional().nullable(),
  preferences: z.object({
    theme: z.object({
      mode: z.enum(['dark', 'light']).optional().default('dark')
    }).optional(),
    notifications: z.object({
      email: z.boolean().optional().default(true)
    }).optional()
  }).optional().nullable()
})

export type ProfileFormData = z.infer<typeof profileSchema>

export async function updateProfile(
  prevState: { error: string | null } | null,
  formData: ProfileFormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Validate the input data
    const validatedData = profileSchema.parse(formData)

    const { error } = await supabase
      .from("profiles")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "An unexpected error occurred" }
  }
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error) {
    console.error('Error updating avatar:', error)
    return { error: "Failed to update avatar" }
  }
}

export async function completeProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/sign-in")
  }

  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string
  const website = formData.get("website") as string
  const bio = formData.get("bio") as string
  const displayName = formData.get("display_name") as string
  const location = formData.get("location") as string
  const occupation = formData.get("occupation") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      display_name: displayName,
      website,
      bio,
      location,
      occupation,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return redirect("/auth/complete-profile?error=Could not update profile")
  }

  return redirect("/dashboard")
} 