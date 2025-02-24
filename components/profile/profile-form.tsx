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
import { Avatar } from './avatar'
import { Icons } from "@/components/icons"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.").nullable(),
  full_name: z.string().min(2, "Full name must be at least 2 characters.").nullable(),
  website: z.string().url("Please enter a valid URL").nullable(),
  bio: z.string().max(160, "Bio must be less than 160 characters.").nullable(),
  avatar_url: z.string().nullable(),
})

type FormData = z.infer<typeof formSchema>

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  email: string
  bio: string | null
  role: 'user' | 'admin'
  preferences: Record<string, unknown>
  last_sign_in: string | null
  created_at: string
  updated_at: string
}

interface ProfileFormProps {
  user: User | null
  onClose?: () => void
}

export function ProfileForm({ user, onClose }: ProfileFormProps) {
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
      website: null,
      bio: null,
      avatar_url: null,
    },
  })

  const getProfile = useCallback(async () => {
    try {
      if (!user?.id) return

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          website,
          email,
          bio,
          role,
          preferences,
          last_sign_in,
          created_at,
          updated_at
        `)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProfile(data)
        form.reset({
          username: data.username,
          full_name: data.full_name,
          website: data.website,
          bio: data.bio,
          avatar_url: data.avatar_url,
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

  async function onSubmit(values: FormData) {
    try {
      setLoading(true)

      if (!user?.id) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...values,
        updated_at: new Date().toISOString(),
      })

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

  const onAvatarUpload = useCallback((url: string) => {
    form.setValue('avatar_url', url)
  }, [form])

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-zinc-500">Please sign in to edit your profile.</p>
      </div>
    )
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Avatar
          uid={user.id}
          url={form.watch('avatar_url')}
          size={150}
          onUpload={onAvatarUpload}
          className="mx-auto"
        />

        <div className="space-y-4">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                value={user.email} 
                disabled 
              />
            </FormControl>
            <FormDescription>
              Your email address is managed by authentication.
            </FormDescription>
          </FormItem>

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
                <FormDescription>
                  Your personal or professional website.
                </FormDescription>
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
        </div>
      </form>
    </Form>
  )
} 