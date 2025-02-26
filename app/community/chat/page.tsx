import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Bot, Hash, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Chat</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Connect in real-time with fellow community members through our chat channels, direct messages, and AI-assisted discussions.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-amber-500" />
              Chat Channels
            </CardTitle>
            <CardDescription>
              Navigate through our organized chat spaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Direct Messages</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• AI Assistant for instant help and guidance</li>
                <li>• Community Team for support and moderation</li>
                <li>• Direct messaging with other members</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Chat Channels</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• General Chat for open discussions</li>
                <li>• Introductions for new members</li>
                <li>• Help & Support for assistance</li>
                <li>• Feedback for suggestions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Feature Discussions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• AI Chat for tech discussions</li>
                <li>• Voice Chat (Beta) for audio communication</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              Members List
            </CardTitle>
            <CardDescription>
              Track member presence and roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Member Categories</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Online members with real-time status</li>
                <li>• Role-based organization (Admin, Mod, Member)</li>
                <li>• Bot accounts for automated assistance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Status Indicators</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Online/Offline status</li>
                <li>• Away and Do Not Disturb modes</li>
                <li>• Current activity indicators</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Direct message initiation</li>
                <li>• Profile viewing</li>
                <li>• Member management (for mods)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Begin your chat experience with these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Join Channels</h3>
                <p className="text-sm text-zinc-400">
                  Start by joining the #introductions channel and say hello to the community.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Set Your Status</h3>
                <p className="text-sm text-zinc-400">
                  Update your availability status to let others know when you're free to chat.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Start Chatting</h3>
                <p className="text-sm text-zinc-400">
                  Engage in discussions or start a direct message with another member.
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
  )
} 