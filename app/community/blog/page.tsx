import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenSquare, Clock, Tags, ArrowRight, Star, FileText } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Blog</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Explore community-driven content, share your insights, and discover the latest posts from our vibrant community of writers.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Blog Content
            </CardTitle>
            <CardDescription>
              Navigate through our organized blog sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Content Types</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Latest Posts</li>
                <li>• Featured Articles</li>
                <li>• Your Drafts</li>
                <li>• Saved Posts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Categories</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Technology & Development</li>
                <li>• Community Updates</li>
                <li>• Tutorials & Guides</li>
                <li>• Announcements</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Popular Tags</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Development</li>
                <li>• Design</li>
                <li>• Community</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Table of Contents
            </CardTitle>
            <CardDescription>
              Navigate post content and track activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Content Navigation</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Auto-generated sections</li>
                <li>• Quick jump to headings</li>
                <li>• Progress tracking</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Post Activity</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• View count tracking</li>
                <li>• Reading time estimates</li>
                <li>• Engagement metrics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Share posts</li>
                <li>• Save for later</li>
                <li>• Copy link</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenSquare className="h-5 w-5 text-amber-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Begin your blogging journey with these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Explore Content</h3>
                <p className="text-sm text-zinc-400">
                  Browse through our latest posts and discover content that interests you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Create Your Post</h3>
                <p className="text-sm text-zinc-400">
                  Start writing your own blog post and share your knowledge with the community.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Engage & Connect</h3>
                <p className="text-sm text-zinc-400">
                  Comment on posts, follow authors, and join the conversation.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/community/blog/new" className="gap-2">
                  Create New Post
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