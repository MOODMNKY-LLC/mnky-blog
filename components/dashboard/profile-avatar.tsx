'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ProfileAvatarProps {
  avatarPath: string | null
  fullName: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-24 w-24'
}

export function ProfileAvatar({ avatarPath, fullName, size = 'lg' }: ProfileAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const supabase = createClient()

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
        console.log('Error downloading avatar:', error)
      }
    }

    if (avatarPath) {
      downloadImage(avatarPath)
    }
  }, [avatarPath, supabase])

  return (
    <Avatar className={`${sizeClasses[size]} ring-2 ring-amber-500/20`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={fullName || ''} />
      ) : (
        <AvatarFallback className="text-lg bg-zinc-900 text-amber-500">
          {fullName?.split(' ').map((n: string) => n[0]).join('') || '??'}
        </AvatarFallback>
      )}
    </Avatar>
  )
} 