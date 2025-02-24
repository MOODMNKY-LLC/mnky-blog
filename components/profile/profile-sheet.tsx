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
import { ProfileForm } from "./profile-form"

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
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ProfileForm 
            user={user} 
            onClose={() => setIsOpen(false)} 
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 