'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Loader2Icon, UploadIcon } from "lucide-react"

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
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

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      console.log('Error uploading avatar: ', error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
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
        <label 
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800/50 hover:text-amber-500"
          htmlFor="single"
        >
          {uploading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="h-4 w-4" />
              Upload Avatar
            </>
          )}
        </label>
        <input
          className="sr-only"
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