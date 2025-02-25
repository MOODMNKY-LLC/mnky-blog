import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Heart, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Join Our Community
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Connect with fellow enthusiasts, share your thoughts, and participate in meaningful discussions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/community/forum">
                  Join the Forum
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/community/members">
                  Meet Members
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Forum Discussions
                </CardTitle>
                <CardDescription>
                  Engage in threaded discussions about various topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/community/forum">
                    Browse Forums
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Member Directory
                </CardTitle>
                <CardDescription>
                  Connect with other community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/community/members">
                    View Members
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Interest Groups
                </CardTitle>
                <CardDescription>
                  Join groups based on shared interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/community/groups">
                    Explore Groups
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {/* Placeholder for activity feed items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Discussion Started</CardTitle>
                <CardDescription>John Doe started a new discussion about mindfulness</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Popular Thread</CardTitle>
                <CardDescription>The thread about meditation techniques is trending</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Member</CardTitle>
                <CardDescription>Welcome Sarah to our community!</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
} 