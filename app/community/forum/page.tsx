import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, ListFilter, Bookmark, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ForumPage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Forum</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Engage in thoughtful discussions, share knowledge, and explore topics with our community through organized forum categories.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListFilter className="h-5 w-5 text-amber-500" />
              Forum Categories
            </CardTitle>
            <CardDescription>
              Browse through our organized discussion spaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">General Discussion</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Welcome & Introductions</li>
                <li>• Community News & Updates</li>
                <li>• Feedback & Suggestions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Technical Topics</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Development Discussions</li>
                <li>• API Integration Help</li>
                <li>• Best Practices & Tips</li>
                <li>• Troubleshooting</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Special Categories</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Featured Discussions</li>
                <li>• Community Spotlights</li>
                <li>• Resource Sharing</li>
              </ul>
            </div>
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
              Track and manage your forum activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Your Activity</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Recent posts and replies</li>
                <li>• Bookmarked discussions</li>
                <li>• Followed topics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Popular Content</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Trending discussions</li>
                <li>• Most viewed topics</li>
                <li>• Featured threads</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Filters</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Unread posts</li>
                <li>• Latest activity</li>
                <li>• Your subscriptions</li>
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
              Begin your forum journey with these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Introduce Yourself</h3>
                <p className="text-sm text-zinc-400">
                  Start by creating an introduction post in the Welcome category.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Browse Categories</h3>
                <p className="text-sm text-zinc-400">
                  Explore different forum categories to find topics that interest you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Join Discussions</h3>
                <p className="text-sm text-zinc-400">
                  Participate in existing threads or start your own discussion.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/community/forum/welcome" className="gap-2">
                  Create Introduction
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