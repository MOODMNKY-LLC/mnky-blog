import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Crown, Shield, Bot, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"

export default function MembersPage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-amber-500">Community</span>{' '}
          <span className="text-zinc-100">Members</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Discover and connect with our vibrant community members, from contributors and moderators to our dedicated admin team.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              Member Overview
            </CardTitle>
            <CardDescription>
              Browse through our community members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Overview</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• All Members</li>
                <li>• Online Now</li>
                <li>• New Members</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Member Roles</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Administrators</li>
                <li>• Moderators</li>
                <li>• Contributors</li>
                <li>• Regular Members</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Special Members</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Bot Accounts</li>
                <li>• Verified Members</li>
                <li>• Featured Contributors</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Features */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              Member Stats
            </CardTitle>
            <CardDescription>
              Track member activity and contributions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Activity Metrics</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Posts and replies</li>
                <li>• Reactions given</li>
                <li>• Topics created</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Achievements</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Badges earned</li>
                <li>• Reputation score</li>
                <li>• Special awards</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-100">Quick Actions</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Follow member</li>
                <li>• Send message</li>
                <li>• View profile</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Begin connecting with community members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">1. Complete Profile</h3>
                <p className="text-sm text-zinc-400">
                  Set up your profile with a bio, avatar, and other details to help others know you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">2. Connect & Follow</h3>
                <p className="text-sm text-zinc-400">
                  Follow other members and start building your community network.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-100">3. Get Involved</h3>
                <p className="text-sm text-zinc-400">
                  Participate in discussions and contribute to earn reputation and badges.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link href="/community/members/directory" className="gap-2">
                  View Directory
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