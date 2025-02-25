'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Icons } from "@/components/icons"

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      if (!uid) {
        throw new Error('User ID is required for upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${uid}.${fileExt}`

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        fileName
      })

      // First, try to remove any existing avatar
      try {
        await supabase.storage
          .from('avatars')
          .remove([fileName])
      } catch (removeError) {
        console.log('No existing avatar to remove or error:', removeError)
      }

      // Upload new avatar
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload successful:', data)
      onUpload(fileName)
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert(error instanceof Error ? error.message : 'Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover ring-2 ring-amber-500/20"
          style={{ height: size, width: size }}
          priority
        />
      ) : (
        <div 
          className="rounded-full bg-zinc-900 ring-2 ring-amber-500/20 flex items-center justify-center text-2xl text-amber-500" 
          style={{ height: size, width: size }}
        >
          ?
        </div>
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Icons.spinner className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            'Upload'
          )}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
} 