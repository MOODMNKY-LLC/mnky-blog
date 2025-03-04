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
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { updateProfile as updateProfileAction, updateAvatar } from "@/app/actions/profile"
import type { ProfileFormData } from "@/app/actions/profile"

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  website: string | null
  email: string
  bio: string | null
  pronouns: string | null
  timezone: string | null
  locale: string | null
  location: string | null
  occupation: string | null
  interests: string[] | null
  expertise: string[] | null
  mood_status: string | null
  availability_status: string | null
  role: 'user' | 'moderator' | 'admin' | 'author' | 'editor'
  reputation: number
  featured_author: boolean
  preferences: {
    theme: {
      mode: 'dark' | 'light'
    }
    notifications: {
      email: boolean
    }
  } | null
  created_at: string
  updated_at: string
  last_seen_at: string | null
  last_sign_in: string | null
}

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>

type FormSection = 'basic' | 'author' | 'preferences' | 'social'

const sectionFields: Record<FormSection, (keyof FormData)[]> = {
  basic: ['username', 'full_name', 'display_name', 'avatar_url'],
  author: ['bio', 'occupation', 'expertise', 'interests', 'pronouns'],
  preferences: ['timezone', 'locale', 'mood_status', 'availability_status', 'preferences'],
  social: ['website', 'location']
}

export interface ProfileFormProps {
  user: User | null
  section?: FormSection
  onClose?: () => void
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC-12:00', label: '(GMT-12:00) International Date Line West' },
  { value: 'UTC-11:00', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'UTC-10:00', label: '(GMT-10:00) Hawaii' },
  { value: 'UTC-09:00', label: '(GMT-09:00) Alaska' },
  { value: 'UTC-08:00', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'UTC-07:00', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'UTC-06:00', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'UTC-05:00', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'UTC-04:00', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'UTC-03:00', label: '(GMT-03:00) Buenos Aires, Georgetown' },
  { value: 'UTC-02:00', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'UTC-01:00', label: '(GMT-01:00) Azores, Cape Verde Islands' },
  { value: 'UTC+00:00', label: '(GMT+00:00) London, Dublin, Edinburgh' },
  { value: 'UTC+01:00', label: '(GMT+01:00) Paris, Amsterdam, Berlin' },
  { value: 'UTC+02:00', label: '(GMT+02:00) Athens, Istanbul, Helsinki' },
  { value: 'UTC+03:00', label: '(GMT+03:00) Moscow, St. Petersburg' },
  { value: 'UTC+04:00', label: '(GMT+04:00) Dubai, Baku, Tbilisi' },
  { value: 'UTC+05:00', label: '(GMT+05:00) Islamabad, Karachi' },
  { value: 'UTC+05:30', label: '(GMT+05:30) Mumbai, Kolkata, Chennai' },
  { value: 'UTC+06:00', label: '(GMT+06:00) Dhaka, Almaty' },
  { value: 'UTC+07:00', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'UTC+08:00', label: '(GMT+08:00) Beijing, Hong Kong, Singapore' },
  { value: 'UTC+09:00', label: '(GMT+09:00) Tokyo, Seoul, Osaka' },
  { value: 'UTC+10:00', label: '(GMT+10:00) Sydney, Melbourne, Brisbane' },
  { value: 'UTC+11:00', label: '(GMT+11:00) Solomon Is., New Caledonia' },
  { value: 'UTC+12:00', label: '(GMT+12:00) Fiji, Auckland, Wellington' },
]

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: '🟢 Available' },
  { value: 'busy', label: '🔴 Busy' },
  { value: 'away', label: '🟡 Away' },
  { value: 'offline', label: '⚫ Offline' },
  { value: 'focus', label: '🎯 Focus Mode' },
  { value: 'vacation', label: '🌴 On Vacation' },
]

export function ProfileForm({ user, onClose, section = 'basic' }: ProfileFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: null,
      full_name: null,
      display_name: null,
      avatar_url: null,
      website: null,
      bio: null,
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
      if (!user?.id) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProfile(data)
        form.reset({
          username: data.username || null,
          full_name: data.full_name || null,
          display_name: data.display_name || null,
          avatar_url: data.avatar_url || null,
          website: data.website || null,
          bio: data.bio || null,
          pronouns: data.pronouns || null,
          timezone: data.timezone || null,
          locale: data.locale || null,
          location: data.location || null,
          occupation: data.occupation || null,
          interests: data.interests || null,
          expertise: data.expertise || null,
          mood_status: data.mood_status || null,
          availability_status: data.availability_status || null,
          preferences: data.preferences || null,
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
  }, [user?.id, supabase, form, toast])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  async function updateProfile(values: Partial<Profile>, isAvatarUpdate = false) {
    try {
      if (isAvatarUpdate) {
        setAvatarUploading(true)
      } else {
        setLoading(true)
      }

      if (!user?.id) {
        throw new Error('User ID is required')
      }

      if (isAvatarUpdate) {
        const result = await updateAvatar(user.id, values.avatar_url!)
        if (result.error) {
          throw new Error(result.error)
        }
      } else {
        const result = await updateProfileAction(null, values as ProfileFormData)
        if (result.error) {
          throw new Error(result.error)
        }
      }

      // Refresh the profile data
      await getProfile()

      toast({
        title: "Success",
        description: isAvatarUpdate ? "Avatar updated successfully!" : "Profile updated successfully!",
      })

      router.refresh()
      
      // Only close if it's a form submission (not avatar update)
      if (!isAvatarUpdate) {
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
      if (isAvatarUpdate) {
        setAvatarUploading(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleAvatarUpload = useCallback(async (url: string) => {
    await updateProfile({ avatar_url: url }, true)
  }, [])

  async function onSubmit(values: FormData) {
    try {
      setLoading(true)

      if (!user?.id) {
        throw new Error('User ID is required')
      }

      // Only update fields that are in the current section
      const sectionFields = {
        basic: ['username', 'full_name', 'display_name', 'avatar_url'],
        author: ['bio', 'occupation', 'expertise', 'interests', 'pronouns'],
        preferences: ['timezone', 'locale', 'mood_status', 'availability_status', 'preferences'],
        social: ['website', 'location']
      }

      // Filter values to only include fields from current section
      const fieldsToUpdate = Object.entries(values)
        .filter(([key]) => sectionFields[section as keyof typeof sectionFields].includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

      const result = await updateProfileAction(null, fieldsToUpdate as ProfileFormData)
      
      if (result.error) {
        throw new Error(result.error)
      }

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
            <FormLabel className="text-zinc-200">Username</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Choose a username"
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              This is your unique identifier on the platform.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Your full name"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              Your legal or preferred full name
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Display Name</FormLabel>
            <FormControl>
              <Input
                placeholder="How should we display your name?"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              This is how your name will appear in comments and posts
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  )

  const renderAuthorFields = () => (
    <>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about yourself"
                className={cn(
                  "resize-none",
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out",
                  "min-h-[100px]"
                )}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              Your author bio that will appear on your profile and published works
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-200">Interests</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Technology, Writing, Art"
                  {...field}
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  className={cn(
                    "bg-zinc-900/50",
                    "border-zinc-800/50",
                    "text-zinc-100",
                    "placeholder:text-zinc-500",
                    "focus:border-amber-500/50",
                    "focus:ring-amber-500/20",
                    "transition-all duration-300 ease-in-out"
                  )}
                />
              </FormControl>
              <FormDescription className="text-zinc-500">
                Topics you're interested in
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-200">Areas of Expertise</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Web Development, AI, Design"
                  {...field}
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  className={cn(
                    "bg-zinc-900/50",
                    "border-zinc-800/50",
                    "text-zinc-100",
                    "placeholder:text-zinc-500",
                    "focus:border-amber-500/50",
                    "focus:ring-amber-500/20",
                    "transition-all duration-300 ease-in-out"
                  )}
                />
              </FormControl>
              <FormDescription className="text-zinc-500">
                Your professional expertise
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="pronouns"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Pronouns</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., they/them"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
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
            <FormLabel className="text-zinc-200">Occupation</FormLabel>
            <FormControl>
              <Input
                placeholder="What do you do?"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
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
            <FormLabel className="text-zinc-200">Timezone</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}>
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "backdrop-blur-sm"
                )}>
                  {TIMEZONE_OPTIONS.map((timezone) => (
                    <SelectItem 
                      key={timezone.value} 
                      value={timezone.value}
                      className="text-zinc-100 focus:bg-zinc-800/50 focus:text-amber-500"
                    >
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription className="text-zinc-500">
              Your local timezone for scheduling and notifications
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="locale"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Language</FormLabel>
            <FormControl>
              <Input
                placeholder="Preferred language"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
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
            <FormLabel className="text-zinc-200">Mood Status</FormLabel>
            <FormControl>
              <Input
                placeholder="How are you feeling?"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
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
            <FormLabel className="text-zinc-200">Availability Status</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}>
                  <SelectValue placeholder="Set your availability" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "backdrop-blur-sm"
                )}>
                  {AVAILABILITY_OPTIONS.map((status) => (
                    <SelectItem 
                      key={status.value} 
                      value={status.value}
                      className="text-zinc-100 focus:bg-zinc-800/50 focus:text-amber-500"
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription className="text-zinc-500">
              Let others know your current status
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferences.theme.mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Theme</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "backdrop-blur-sm"
                )}>
                  <SelectItem value="dark" className="text-zinc-100 focus:bg-zinc-800/50 focus:text-amber-500">Dark</SelectItem>
                  <SelectItem value="light" className="text-zinc-100 focus:bg-zinc-800/50 focus:text-amber-500">Light</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferences.notifications.email"
        render={({ field }) => (
          <FormItem className={cn(
            "flex flex-row items-center justify-between rounded-lg",
            "border border-zinc-800/50",
            "bg-zinc-900/50",
            "p-4"
          )}>
            <div className="space-y-0.5">
              <FormLabel className="text-base text-zinc-200">Email Notifications</FormLabel>
              <FormDescription className="text-zinc-500">
                Receive email notifications about important updates
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-amber-500"
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
            <FormLabel className="text-zinc-200">Website</FormLabel>
            <FormControl>
              <Input
                placeholder="Your website URL"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              Your personal website or portfolio
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-200">Location</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., New York, NY"
                {...field}
                value={field.value || ''}
                className={cn(
                  "bg-zinc-900/50",
                  "border-zinc-800/50",
                  "text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:border-amber-500/50",
                  "focus:ring-amber-500/20",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </FormControl>
            <FormDescription className="text-zinc-500">
              Where are you based?
            </FormDescription>
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
            <div className="flex flex-col items-center gap-2 mb-6">
              <Avatar
                uid={user?.id || ''}
                url={profile?.avatar_url || null}
                size={32}
                onUpload={(url) => {
                  updateProfile({ avatar_url: url }, true)
                }}
              />
              <div className="flex flex-col items-center gap-1">
                {profile?.role && (
                  <span className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                    {
                      "bg-amber-400/10 text-amber-500 ring-amber-400/20": profile.role.toLowerCase() === 'admin',
                      "bg-blue-400/10 text-blue-400 ring-blue-400/20": profile.role.toLowerCase() === 'moderator',
                      "bg-green-400/10 text-green-400 ring-green-400/20": profile.role.toLowerCase() === 'author',
                      "bg-purple-400/10 text-purple-400 ring-purple-400/20": profile.role.toLowerCase() === 'editor'
                    }
                  )}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1).toLowerCase()}
                  </span>
                )}
                <p className="text-sm text-zinc-400">
                  {avatarUploading ? 'Uploading...' : 'Click avatar to update'}
                </p>
              </div>
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
            className={cn(
              "border-zinc-800/50",
              "bg-zinc-900/50",
              "text-zinc-400",
              "hover:bg-zinc-800/50",
              "hover:text-amber-500",
              "hover:border-amber-500/50",
              "shadow-[0_0_12px_0_rgba(245,158,11,0.1)]",
              "transition-all duration-300 ease-in-out"
            )}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "bg-amber-500",
              "text-zinc-900",
              "hover:bg-amber-600",
              "shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
              "transition-all duration-300 ease-in-out"
            )}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 