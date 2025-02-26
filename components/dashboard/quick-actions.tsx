"use client"

import { useEffect, useState, useRef } from "react"
import { ImageIcon, Pencil1Icon, GearIcon } from "@radix-ui/react-icons"
import { motion, useSpring, useTransform, useMotionValue, type MotionValue } from "framer-motion"
import { DockIcon } from "@/components/magicui/dock"
import { ChatDrawer } from "@/components/chat/chat-drawer"
import { Button } from "@/components/ui/button"
import { ProfileSheet } from "@/components/profile/profile-sheet"
import { createClient } from "@/utils/supabase/client"
import { type User } from '@supabase/supabase-js'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DndContext,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import Image from "next/image"
import { ChatConfigSheet } from "@/components/chat/chat-config-sheet"
import { Bot, MessagesSquare, Mail } from "lucide-react"
import { StarIcon } from "@radix-ui/react-icons"

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

interface VerticalDockIconProps {
  children: React.ReactNode
  mouseY: MotionValue<number>
}

function VerticalDockIcon({ children, mouseY }: VerticalDockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Constants for magnification
  const baseHeight = 56
  const magnification = 82
  const distance = 100

  const distanceFromMouse = useTransform(mouseY, (mouseYPos) => {
    if (!ref.current) return 0
    const rect = ref.current.getBoundingClientRect()
    const itemCenter = rect.top + rect.height / 2
    return mouseYPos - itemCenter
  })

  const heightSync = useTransform(distanceFromMouse, [-distance, 0, distance], [
    baseHeight,
    magnification,
    baseHeight,
  ])

  const height = useSpring(heightSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{
        height,
        width: height,
      }}
      className="relative flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <DockIcon className="bg-gradient-to-b from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 rounded-full h-full w-full group">
          {children}
        </DockIcon>
      </div>
    </motion.div>
  )
}

export function QuickActions() {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 0 })

  useEffect(() => {
    setMounted(true)
    // Set initial position and handle resize
    const updatePosition = () => {
      setPosition(prev => ({ ...prev, y: window.innerHeight / 3 }))
    }
    
    // Set initial position
    updatePosition()
    
    // Update position on window resize
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { delta } = event
    setPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }))
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null

  return (
    <div 
      className="fixed" 
      style={{ 
        left: position.x,
        top: position.y,
      }}
    >
      <TooltipProvider>
        <DndContext 
          id="quick-actions-dock"
          modifiers={[restrictToWindowEdges]}
          onDragEnd={handleDragEnd}
        >
          <DraggableDock />
        </DndContext>
      </TooltipProvider>
    </div>
  )
}

function DraggableDock() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "quick-actions-dock"
  });
  const mouseY = useMotionValue(0);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    getProfile();
  }, [supabase]);

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

    if (profile?.avatar_url) {
      downloadImage(profile.avatar_url)
    }
  }, [profile?.avatar_url, supabase]);

  useEffect(() => {
    if (user) {
      // Fetch favorites will be implemented later
      // fetchFavorites();
    }
  }, [user]);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="absolute touch-none"
    >
      <div className="rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 p-2">
        <div className="flex flex-col items-center gap-3">
          <div 
            className="flex h-8 w-full cursor-move items-center justify-center px-2 py-1.5 group"
            {...listeners} 
            {...attributes}
          >
            <div className="relative flex flex-col items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10 text-amber-500 opacity-70 group-hover:opacity-100 transition-all duration-300"
              >
                <circle cx="6" cy="8" r="2" fill="currentColor" />
                <circle cx="6" cy="16" r="2" fill="currentColor" />
                <circle cx="12" cy="8" r="2" fill="currentColor" />
                <circle cx="12" cy="16" r="2" fill="currentColor" />
                <circle cx="18" cy="8" r="2" fill="currentColor" />
                <circle cx="18" cy="16" r="2" fill="currentColor" />
              </svg>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-colors duration-300" />
            </div>
          </div>
          <motion.div 
            className="flex flex-col items-center gap-4 py-2"
            onMouseMove={(e: React.MouseEvent) => mouseY.set(e.pageY)}
            onMouseLeave={() => mouseY.set(0)}
          >
            <VerticalDockIcon mouseY={mouseY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group h-full w-full rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-amber-500/5"
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Pencil1Icon className="h-8 w-8 text-amber-500 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900/90 border-zinc-800/50 text-amber-500/90">
                  <p>Create New Blog Post</p>
                </TooltipContent>
              </Tooltip>
            </VerticalDockIcon>
            <VerticalDockIcon mouseY={mouseY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group h-full w-full rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-amber-500/5"
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Mail className="h-8 w-8 text-amber-500 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900/90 border-zinc-800/50 text-amber-500/90">
                  <p>Inbox</p>
                </TooltipContent>
              </Tooltip>
            </VerticalDockIcon>
            <VerticalDockIcon mouseY={mouseY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group h-full w-full rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-amber-500/5"
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <MessagesSquare className="h-8 w-8 text-amber-500 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900/90 border-zinc-800/50 text-amber-500/90">
                  <p>Messages</p>
                </TooltipContent>
              </Tooltip>
            </VerticalDockIcon>
            <VerticalDockIcon mouseY={mouseY}>
              <div className="relative h-full w-full group">
                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <ChatDrawer className="h-full w-full flex items-center justify-center relative z-10" />
              </div>
            </VerticalDockIcon>
            <VerticalDockIcon mouseY={mouseY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group h-full w-full rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-amber-500/5">
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <ChatConfigSheet>
                      <div className="h-full w-full rounded-full flex items-center justify-center relative z-10">
                        <GearIcon className="h-8 w-8 text-amber-500 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
                      </div>
                    </ChatConfigSheet>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900/90 border-zinc-800/50 text-amber-500/90">
                  <p>Configure Chat Assistant</p>
                </TooltipContent>
              </Tooltip>
            </VerticalDockIcon>
            <VerticalDockIcon mouseY={mouseY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group h-full w-full rounded-full relative transition-all duration-300">
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-[-3px] rounded-full bg-gradient-to-b from-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <ProfileSheet user={user}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-full w-full rounded-full flex items-center justify-center relative z-10"
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={profile?.full_name || 'Avatar'}
                            width={32}
                            height={32}
                            className="rounded-full object-cover ring-2 ring-amber-500/20"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-medium">
                            {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                          </div>
                        )}
                      </Button>
                    </ProfileSheet>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900/90 border-zinc-800/50 text-amber-500/90">
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
            </VerticalDockIcon>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 