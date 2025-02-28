"use client"

import { useState } from "react"
import { type User } from '@supabase/supabase-js'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { PostgrestError } from '@supabase/supabase-js'
import { Icons } from "@/components/icons"

interface ProfileSheetProps {
  user: User | null
  children?: React.ReactNode
}

type UserRole = 'ADMIN' | 'MODERATOR' | 'USER' | 'admin' | 'moderator' | 'user' | 'author' | 'editor'

export function ProfileSheet({ user, children }: ProfileSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<UserRole>('user')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic')
  const supabase = createClient()

  useEffect(() => {
    async function checkRole() {
      try {
        if (!user) {
          setRole('user')
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
            // Profile doesn't exist yet, which is fine - they'll get one when they first load the form
            setRole('user')
          } else {
            console.error('Error fetching role:', error.message, error.details)
          }
          setLoading(false)
          return
        }

        setRole(data.role as UserRole)
      } catch (error) {
        const pgError = error as PostgrestError
        console.error('Error in role check:', pgError.message, pgError.details)
        setRole('user') // Fallback to user role on error
      } finally {
        setLoading(false)
      }
    }

    checkRole()
  }, [user, supabase])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (loading) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Loading your profile...
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center p-8">
            <Icons.spinner className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const isAdmin = role.toLowerCase() === 'admin'
  const isModerator = role.toLowerCase() === 'moderator'
  const isAuthor = role.toLowerCase() === 'author'

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            {isAdmin && "Make changes to your admin profile here."}
            {isModerator && "Make changes to your moderator profile here."}
            {isAuthor && "Make changes to your author profile here."}
            {!isAdmin && !isModerator && !isAuthor && "Make changes to your profile here."}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <Tabs 
            defaultValue="basic" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
              {(isAdmin || isModerator || isAuthor) && (
                <TabsTrigger value="author" className="flex-1">Author Info</TabsTrigger>
              )}
              <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
              <TabsTrigger value="social" className="flex-1">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <ProfileForm 
                user={user} 
                section="basic" 
                onClose={handleClose} 
              />
            </TabsContent>
            {(isAdmin || isModerator || isAuthor) && (
              <TabsContent value="author">
                <ProfileForm 
                  user={user} 
                  section="author" 
                  onClose={handleClose} 
                />
              </TabsContent>
            )}
            <TabsContent value="preferences">
              <ProfileForm 
                user={user} 
                section="preferences" 
                onClose={handleClose} 
              />
            </TabsContent>
            <TabsContent value="social">
              <ProfileForm 
                user={user} 
                section="social" 
                onClose={handleClose} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
} 