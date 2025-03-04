'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Bot, Hash, ArrowRight, MessageCircle, ListFilter, Bookmark } from "lucide-react"
import Link from "next/link"
import { InitializeChannelsButton } from '@/components/community/chat/initialize-channels-button'
import { CheckRolesButton } from '@/components/community/chat/check-roles-button'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const cookieStore = await cookies() as unknown as RequestCookies
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) redirect('/login')

  // Get all channels
  const { data: channels, error: channelsError } = await supabase
    .from('channels')
    .select('*')
    .order('created_at', { ascending: true })

  if (channelsError) {
    console.error('Error fetching channels:', channelsError)
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="text-amber-500">Community</span>{' '}
            <span className="text-zinc-100">Chat</span>
          </h1>
          <p className="text-lg text-zinc-400">
            Set up your chat channels and start connecting with the community.
          </p>
        </div>
        <div className="max-w-5xl mx-auto w-full">
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <span>Initialize Chat</span>
              </CardTitle>
              <CardDescription>
                Set up your chat channels and get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InitializeChannelsButton />
              <CheckRolesButton />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Chat</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Connect with the community in real-time through our organized chat channels.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Sidebar Features */}
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-amber-500" />
                Chat Channels
              </CardTitle>
              <CardDescription>
                Browse through our active chat spaces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels?.map((channel) => (
                <Link 
                  key={channel.id} 
                  href={`/community/chat/${channel.slug}`}
                  className="block"
                >
                  <div className="space-y-2 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-medium text-zinc-100">{channel.name}</h3>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {channel.metadata?.member_count || 0} members
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {channel.description || 'Join the conversation'}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Right Sidebar Features */}
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-amber-500" />
                Quick Access
              </CardTitle>
              <CardDescription>
                Track and manage your chat activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">Your Activity</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Recent conversations</li>
                  <li>• Favorite channels</li>
                  <li>• Direct messages</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">Popular Channels</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Most active discussions</li>
                  <li>• Featured topics</li>
                  <li>• Community highlights</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Start new chat</li>
                  <li>• Browse channels</li>
                  <li>• Manage notifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-amber-500" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Begin your chat journey with these steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">1. Join a Channel</h3>
                  <p className="text-sm text-zinc-400">
                    Browse available channels and join the ones that interest you.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">2. Start Chatting</h3>
                  <p className="text-sm text-zinc-400">
                    Engage in real-time conversations with community members.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">3. Stay Connected</h3>
                  <p className="text-sm text-zinc-400">
                    Follow channels and manage your notifications to stay updated.
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link href="/community/chat/general" className="gap-2">
                    Join General Chat
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 