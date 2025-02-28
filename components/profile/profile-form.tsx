'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { type User } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Avatar from './avatar'
import { Icons } from "@/components/icons"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").optional().nullable(),
  full_name: z.string().min(2, "Full name must be at least 2 characters.").optional().nullable(),
  display_name: z.string().min(2, "Display name must be at least 2 characters.").optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  website: z.string().url("Please enter a valid URL").optional().nullable(),
  bio: z.string().max(160, "Bio must be less than 160 characters.").optional().nullable(),
  author_bio: z.string().max(500, "Author bio must be less than 500 characters.").optional().nullable(),
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

type FormData = z.infer<typeof formSchema>

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  website: string | null
  email: string
  bio: string | null
  author_bio: string | null
  pronouns: string | null
  timezone: string | null
  locale: string
  location: string | null
  occupation: string | null
  interests: string[] | null
  expertise: string[] | null
  mood_status: string | null
  availability_status: string | null
  role: 'user' | 'moderator' | 'admin' | 'author' | 'editor' | 'ADMIN' | 'MODERATOR' | 'USER'
  preferences: {
    theme: {
      mode: 'dark' | 'light'
    }
    notifications: {
      email: boolean
    }
  } | null
  featured_author: boolean
  reputation: number
  last_sign_in: string | null
  created_at: string
  updated_at: string
}

interface ProfileFormProps {
  user: User | null
  onClose?: () => void
  section?: 'basic' | 'author' | 'preferences' | 'social'
}

export function ProfileForm({ user, onClose, section = 'basic' }: ProfileFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: null,
      full_name: null,
      display_name: null,
      avatar_url: null,
      website: null,
      bio: null,
      author_bio: null,
      pronouns: null,
      timezone: null,
      locale: null,
      location: null,
      occupation: null,
      interests: null,
      expertise: null,
      mood_status: null,
      availability_status: null,
      preferences: null,
    },
  })

  const getProfile = useCallback(async () => {
    try {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          display_name,
          avatar_url,
          website,
          email,
          bio,
          author_bio,
          pronouns,
          timezone,
          locale,
          location,
          occupation,
          interests,
          expertise,
          mood_status,
          availability_status,
          role,
          preferences,
          featured_author,
          reputation,
          last_sign_in,
          created_at,
          updated_at
        `)
        .eq('id', user.id)
        .single()

      if (error) {
        if (status !== 406) {
          throw error
        }
        // Handle 406 (Not Acceptable) - typically means no profile exists yet
        setProfile(null)
        form.reset({
          username: null,
          full_name: null,
          display_name: null,
          avatar_url: null,
          website: null,
          bio: null,
          author_bio: null,
          pronouns: null,
          timezone: null,
          locale: null,
          location: null,
          occupation: null,
          interests: null,
          expertise: null,
          mood_status: null,
          availability_status: null,
          preferences: null,
        })
        return
      }

      if (data) {
        setProfile(data)
        form.reset({
          username: data.username,
          full_name: data.full_name,
          display_name: data.display_name,
          avatar_url: data.avatar_url,
          website: data.website,
          bio: data.bio,
          author_bio: data.author_bio,
          pronouns: data.pronouns,
          timezone: data.timezone,
          locale: data.locale,
          location: data.location,
          occupation: data.occupation,
          interests: data.interests,
          expertise: data.expertise,
          mood_status: data.mood_status,
          availability_status: data.availability_status,
          preferences: data.preferences,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error loading user data:', errorMessage)
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, supabase, toast, form])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  async function updateProfile(values: Partial<Profile>) {
    try {
      setLoading(true)

      if (!user?.id) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase.from('profiles').update({
        ...values,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      router.refresh()
      // Only close if it's an avatar update or explicit save
      if (values.avatar_url || Object.keys(values).length > 1) {
        onClose?.()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error updating profile:', errorMessage)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: FormData) {
    try {
      setLoading(true)

      if (!user?.id) {
        throw new Error('User ID is required')
      }

      // Only update fields that are in the current section
      const sectionFields = {
        basic: ['username', 'full_name', 'display_name', 'avatar_url', 'bio', 'pronouns'],
        author: ['author_bio', 'expertise', 'interests'],
        preferences: ['timezone', 'locale', 'mood_status', 'availability_status', 'preferences'],
        social: ['website', 'location', 'occupation']
      }

      // Filter values to only include fields from current section
      const fieldsToUpdate = Object.entries(values)
        .filter(([key]) => sectionFields[section as keyof typeof sectionFields].includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

      const { error } = await supabase.from('profiles').update({
        ...fieldsToUpdate,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      router.refresh()
      onClose?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error updating profile:', errorMessage)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderBasicFields = () => (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                placeholder="username"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Full name"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Display name"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Brief description for your profile.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pronouns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pronouns</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., she/her"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )

  const renderAuthorFields = () => (
    <>
      <FormField
        control={form.control}
        name="author_bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your writing journey"
                className="resize-none"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              This bio will appear on your author profile and published works.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expertise"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Areas of Expertise</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Fiction, Poetry, Technical Writing"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
              />
            </FormControl>
            <FormDescription>
              Separate multiple areas with commas
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Writing Interests</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Sci-Fi, Romance, Technology"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
              />
            </FormControl>
            <FormDescription>
              Separate multiple interests with commas
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  )

  const renderPreferenceFields = () => (
    <>
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timezone</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., UTC+1"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="locale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language & Region</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., en-US"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mood_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mood Status</FormLabel>
            <FormControl>
              <Input
                placeholder="How are you feeling?"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availability_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Available, Busy, Away"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )

  const renderSocialFields = () => (
    <>
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://example.com"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., New York, NY"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Writer, Editor"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-zinc-500">Please sign in to edit your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {section === 'basic' && (
          <>
            <div className="flex flex-col items-center gap-2">
              <Avatar
                uid={user.id}
                url={profile?.avatar_url || null}
                size={150}
                onUpload={(url) => {
                  updateProfile({ avatar_url: url })
                }}
              />
              {(profile?.role === 'admin' || profile?.role === 'ADMIN') && (
                <span className="inline-flex items-center rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-400/20">
                  Admin
                </span>
              )}
              {(profile?.role === 'moderator' || profile?.role === 'MODERATOR') && (
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                  Moderator
                </span>
              )}
              {profile?.role === 'author' && (
                <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                  Author
                </span>
              )}
              {profile?.role === 'editor' && (
                <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/20">
                  Editor
                </span>
              )}
            </div>
            {renderBasicFields()}
          </>
        )}
        {section === 'author' && renderAuthorFields()}
        {section === 'preferences' && renderPreferenceFields()}
        {section === 'social' && renderSocialFields()}

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 