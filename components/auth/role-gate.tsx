'use client'

import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'
import { Icons } from '@/components/icons'

type UserRole = 'ADMIN' | 'MODERATOR' | 'USER' | 'admin' | 'moderator' | 'user' | 'author' | 'editor'

interface RoleGateProps {
  children: React.ReactNode
  user: User | null
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
  showLoading?: boolean
}

export function RoleGate({ 
  children, 
  user, 
  allowedRoles, 
  fallback = null,
  showLoading = false
}: RoleGateProps) {
  const [canAccess, setCanAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkRole() {
      try {
        if (!user) {
          setCanAccess(false)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist yet, default to USER/user role
            setCanAccess(allowedRoles.includes('USER') || allowedRoles.includes('user'))
          } else {
            console.error('Error checking role:', error.message, error.details)
            setCanAccess(false)
          }
          setLoading(false)
          return
        }

        // Handle both uppercase and lowercase role values
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase())
        const userRole = (data.role as string).toLowerCase()
        setCanAccess(normalizedAllowedRoles.includes(userRole))
      } catch (error) {
        const pgError = error as PostgrestError
        console.error('Error in role check:', pgError.message, pgError.details)
        setCanAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkRole()
  }, [user, allowedRoles, supabase])

  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Icons.spinner className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  if (loading) {
    return null
  }

  return canAccess ? children : fallback
} 