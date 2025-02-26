import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Flame, ArrowRight, Hash } from "lucide-react"
import Link from "next/link"

export default function DiscussionsPage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Discussions</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Join focused discussions, share ideas, and collaborate with other community members in organized topic-based conversations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-amber-500" />
              Discussion Topics
            </CardTitle>
            <CardDescription>
              Browse through our organized discussion spaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Discover</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Trending Discussions</li>
                <li>• Featured Topics</li>
                <li>• Bookmarked Threads</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Topics</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• General Discussions</li>
                <li>• Technology & Development</li>
                <li>• Community Feedback</li>
                <li>• Help & Support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Discussion Groups</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Developer Circle</li>
                <li>• Design Community</li>
                <li>• Content Creators</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              Participants
            </CardTitle>
            <CardDescription>
              Track discussion participants and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Member Roles</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Discussion authors</li>
                <li>• Active contributors</li>
                <li>• Moderators</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Activity Tracking</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Recent participants</li>
                <li>• Active members</li>
                <li>• Top contributors</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Follow discussion</li>
                <li>• Invite members</li>
                <li>• Share thread</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Begin participating in community discussions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Find Topics</h3>
                <p className="text-sm text-zinc-400">
                  Browse through discussion categories and find topics that interest you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Join Groups</h3>
                <p className="text-sm text-zinc-400">
                  Connect with like-minded members in specialized discussion groups.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Start Discussing</h3>
                <p className="text-sm text-zinc-400">
                  Create new topics or contribute to existing discussions.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/community/discussions/new" className="gap-2">
                  Start Discussion
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