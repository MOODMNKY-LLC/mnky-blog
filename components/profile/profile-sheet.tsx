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

interface ProfileSheetProps {
  user: User | null
  children?: React.ReactNode
}

export function ProfileSheet({ user, children }: ProfileSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="basic" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="author">Author</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <TabsContent value="basic" className="py-6">
              <ProfileForm 
                user={user} 
                onClose={() => setIsOpen(false)}
                section="basic"
              />
            </TabsContent>
            <TabsContent value="author" className="py-6">
              <ProfileForm 
                user={user} 
                onClose={() => setIsOpen(false)}
                section="author"
              />
            </TabsContent>
            <TabsContent value="preferences" className="py-6">
              <ProfileForm 
                user={user} 
                onClose={() => setIsOpen(false)}
                section="preferences"
              />
            </TabsContent>
            <TabsContent value="social" className="py-6">
              <ProfileForm 
                user={user} 
                onClose={() => setIsOpen(false)}
                section="social"
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
} 