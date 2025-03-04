"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Megaphone, Sparkles, Users } from "lucide-react"

const updates = [
  {
    id: 1,
    title: "Welcome to MOOD MNKY Community!",
    description: "We're excited to launch our new community platform. Join us in creating a space for scent, sound, and self-reflection.",
    date: "2024-02-26",
    type: "announcement",
    icon: Megaphone,
  },
  {
    id: 2,
    title: "New AI Features Available",
    description: "Our AI assistant is now available to help you discover new scents and create personalized experiences.",
    date: "2024-02-25",
    type: "feature",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Community Guidelines",
    description: "Please review our community guidelines to ensure a positive experience for everyone.",
    date: "2024-02-24",
    type: "info",
    icon: Users,
  },
]

export function CommunityUpdates() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <update.icon className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-lg">{update.title}</CardTitle>
              </div>
              <Badge variant="outline" className="border-amber-500/50 text-amber-500">
                {update.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                {update.description}
              </CardDescription>
              <div className="mt-4 flex items-center text-xs text-zinc-500">
                <Bell className="mr-1 h-3 w-3" />
                {new Date(update.date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
} 