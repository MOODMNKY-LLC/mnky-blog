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
import { cn } from "@/lib/utils"

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
        if (!user?.id) {
          setRole('user');
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching role:', error);
          setRole('user');
          setLoading(false);
          return;
        }

        if (!data) {
          console.error('No profile data found');
          setRole('user');
          setLoading(false);
          return;
        }

        setRole((data.role as UserRole) || 'user');
      } catch (error) {
        console.error('Error in role check:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, [user, supabase]);

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className={cn(
          "w-full sm:max-w-[600px]",
          "bg-zinc-900/50 dark:bg-zinc-900/50",
          "backdrop-blur-sm",
          "border-zinc-800/50",
          "shadow-[0_0_12px_0_rgba(245,158,11,0.2)]"
        )}>
          <SheetHeader>
            <SheetTitle className="text-zinc-100">Edit Profile</SheetTitle>
            <SheetDescription className="text-zinc-400">
              Loading your profile...
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center p-8">
            <Icons.spinner className="h-6 w-6 animate-spin text-amber-500" />
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
      <SheetContent className={cn(
        "w-full sm:max-w-[600px]",
        "bg-zinc-900/50",
        "backdrop-blur-sm",
        "border-zinc-800/50",
        "shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
        "transition-all duration-300 ease-in-out"
      )}>
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl font-semibold text-zinc-100">Edit Profile</SheetTitle>
          <SheetDescription className="text-sm text-zinc-400">
            {isAdmin && "Make changes to your admin profile here."}
            {isModerator && "Make changes to your moderator profile here."}
            {isAuthor && "Make changes to your author profile here."}
            {!isAdmin && !isModerator && !isAuthor && "Make changes to your profile here."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <Tabs 
            defaultValue="basic" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col space-y-4">
              <TabsList className={cn(
                "w-full grid",
                {
                  "grid-cols-4": isAdmin || isModerator || isAuthor,
                  "grid-cols-3": !(isAdmin || isModerator || isAuthor)
                },
                "gap-2",
                "bg-transparent",
                "p-0"
              )}>
                <TabsTrigger 
                  value="basic" 
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "h-10",
                    "bg-zinc-900/50",
                    "border border-zinc-800/50",
                    "rounded-full",
                    "text-sm font-medium",
                    "data-[state=active]:bg-zinc-800/50",
                    "data-[state=active]:text-amber-500",
                    "data-[state=active]:border-amber-500/50",
                    "data-[state=active]:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
                    "text-zinc-400",
                    "hover:text-zinc-100",
                    "hover:border-zinc-700/50",
                    "transition-all duration-300 ease-in-out"
                  )}
                >
                  Basic Info
                </TabsTrigger>
                {(isAdmin || isModerator || isAuthor) && (
                  <TabsTrigger 
                    value="author" 
                    className={cn(
                      "flex items-center justify-center gap-2",
                      "h-10",
                      "bg-zinc-900/50",
                      "border border-zinc-800/50",
                      "rounded-full",
                      "text-sm font-medium",
                      "data-[state=active]:bg-zinc-800/50",
                      "data-[state=active]:text-amber-500",
                      "data-[state=active]:border-amber-500/50",
                      "data-[state=active]:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
                      "text-zinc-400",
                      "hover:text-zinc-100",
                      "hover:border-zinc-700/50",
                      "transition-all duration-300 ease-in-out"
                    )}
                  >
                    Author Info
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="preferences" 
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "h-10",
                    "bg-zinc-900/50",
                    "border border-zinc-800/50",
                    "rounded-full",
                    "text-sm font-medium",
                    "data-[state=active]:bg-zinc-800/50",
                    "data-[state=active]:text-amber-500",
                    "data-[state=active]:border-amber-500/50",
                    "data-[state=active]:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
                    "text-zinc-400",
                    "hover:text-zinc-100",
                    "hover:border-zinc-700/50",
                    "transition-all duration-300 ease-in-out"
                  )}
                >
                  Preferences
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "h-10",
                    "bg-zinc-900/50",
                    "border border-zinc-800/50",
                    "rounded-full",
                    "text-sm font-medium",
                    "data-[state=active]:bg-zinc-800/50",
                    "data-[state=active]:text-amber-500",
                    "data-[state=active]:border-amber-500/50",
                    "data-[state=active]:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
                    "text-zinc-400",
                    "hover:text-zinc-100",
                    "hover:border-zinc-700/50",
                    "transition-all duration-300 ease-in-out"
                  )}
                >
                  Social
                </TabsTrigger>
              </TabsList>

              <div className="relative">
                <div className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-gradient-to-b from-amber-500/10 to-transparent",
                  "pointer-events-none",
                  "h-px"
                )} />
                
                <ScrollArea className="h-[calc(100vh-20rem)] mt-4 rounded-lg">
                  <TabsContent value="basic" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ProfileForm 
                      user={user} 
                      section="basic" 
                      onClose={handleClose} 
                    />
                  </TabsContent>
                  {(isAdmin || isModerator || isAuthor) && (
                    <TabsContent value="author" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <ProfileForm 
                        user={user} 
                        section="author" 
                        onClose={handleClose} 
                      />
                    </TabsContent>
                  )}
                  <TabsContent value="preferences" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ProfileForm 
                      user={user} 
                      section="preferences" 
                      onClose={handleClose} 
                    />
                  </TabsContent>
                  <TabsContent value="social" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ProfileForm 
                      user={user} 
                      section="social" 
                      onClose={handleClose} 
                    />
                  </TabsContent>
                </ScrollArea>
              </div>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
} 