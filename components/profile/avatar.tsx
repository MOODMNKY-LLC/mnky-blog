'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface AvatarProps {
  uid: string | null
  url: string | null | undefined
  size?: number
  onUpload: (url: string) => void
  className?: string
}

export function Avatar({ uid, url, size = 150, onUpload, className }: AvatarProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url ?? null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setAvatarUrl(url ?? null)
  }, [url])

  useEffect(() => {
    if (!url) return

    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)

        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.error('Error downloading image:', error)
        toast({
          title: "Error Loading Avatar",
          description: "Failed to load avatar image. Please try again.",
          variant: "destructive",
        })
      }
    }

    downloadImage(url)
  }, [url, supabase, toast])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      if (!uid) {
        throw new Error('You must be logged in to upload an avatar.')
      }

      const file = event.target.files[0]
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload a JPEG, PNG, GIF, or WebP image.')
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload an image smaller than 5MB.')
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${uid}/${Date.now()}.${fileExt}`

      // Check if avatars bucket exists and user has access
      const { error: bucketError } = await supabase.storage
        .getBucket('avatars')

      if (bucketError) {
        console.error('Bucket check error:', bucketError)
        throw new Error('Unable to access avatar storage. Please try again later.')
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      onUpload(fileName)
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="h-32 w-32 rounded-full object-cover ring-2 ring-amber-500/20"
            width={size}
            height={size}
            priority
          />
        ) : (
          <div 
            className="h-32 w-32 rounded-full bg-zinc-900 ring-2 ring-amber-500/20 flex items-center justify-center text-2xl text-amber-500"
          >
            ?
          </div>
        )}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <Button
            variant="outline"
            size="sm"
            className="relative border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
            <input
              type="file"
              id="single"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={uploadAvatar}
              disabled={uploading}
              className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </Button>
        </div>
      </div>
    </div>
  )
} 