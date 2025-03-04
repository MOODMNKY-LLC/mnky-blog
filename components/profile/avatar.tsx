'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'

interface AvatarUploadProps {
  uid: string
  url: string | null
  size?: number
  onUpload: (url: string) => void
}

export default function AvatarUpload({ uid, url, size = 150, onUpload }: AvatarUploadProps) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error
      
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.error('Error downloading image: ', error)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      onUpload(filePath)
    } catch (error) {
      console.error('Error uploading avatar: ', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group">
      <Avatar className={cn(
        `h-[${size}px] w-[${size}px]`,
        "border-2 border-zinc-800/50",
        "hover:border-amber-500/50",
        "hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
        "transition-all duration-300 ease-in-out"
      )}>
        {avatarUrl ? (
          <AvatarImage
            src={avatarUrl}
            alt="Avatar"
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-zinc-900/50 text-amber-500">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </AvatarFallback>
        )}
      </Avatar>
      
      <label
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-zinc-900/80 backdrop-blur-sm",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
          "cursor-pointer rounded-full"
        )}
        htmlFor="single"
      >
        <div className="flex flex-col items-center gap-2">
          <Camera className="h-6 w-6 text-amber-500" />
          <span className="text-xs font-medium text-zinc-400">
            {uploading ? 'Uploading...' : 'Change Avatar'}
          </span>
        </div>
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
  )
} 