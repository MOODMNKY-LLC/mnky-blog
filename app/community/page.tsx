import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Users, 
  MessagesSquare, 
  PenSquare, 
  BookOpen, 
  Calendar,
  ArrowRight,
  Activity,
  Bell,
  Sparkles,
  PartyPopper,
  Bot,
  Star,
  Quote,
  Heart,
  Crown,
  Trophy,
  CheckCircle2,
  Flame,
  Hash,
  Clock,
  Globe,
  Layers,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"
import { QuoteCarousel } from '@/components/community/quotes/QuoteCarousel'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

async function getCommunityStats() {
  const supabase = await createClient()

  // Get total members
  const { count: membersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get online members
  const { count: onlineCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('availability_status', 'ONLINE')

  // Get active discussions
  const { count: discussionsCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  // Get featured member
  const { data: featuredMember } = await supabase
    .from('profiles')
    .select(`
      *,
      messages:messages(count),
      reactions:message_reactions(count)
    `)
    .eq('is_featured', true)
    .single()

  // Get quotes
  const { data: quotes } = await supabase
    .from('daily_quotes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalMembers: membersCount || 0,
    onlineMembers: onlineCount || 0,
    activeDiscussions: discussionsCount || 0,
    quotes: quotes || [{
      id: '1',
      text: "Every moment is a fresh beginning.",
      author: "T.S. Eliot",
      type: "inspiration",
      is_active: true
    }],
    featuredMember: featuredMember || {
      id: '1',
      username: 'mnky',
      full_name: 'MOOD MNKY',
      avatar_url: '/logo.png',
      bio: 'Community founder and digital explorer.',
      role: 'admin',
      messages: { count: 42 },
      reactions: { count: 156 }
    }
  }
}

export default async function CommunityPage() {
  const stats = await getCommunityStats()

  return (
    <div className="min-h-screen">
      <div className="relative border-b border-zinc-800/50">
        <div className="relative mx-auto max-w-[1920px] px-6 pt-8 pb-6 sm:px-8">
          <div className="relative z-10">
            {/* Top Section: Welcome + Stats */}
            <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
              {/* Welcome Text */}
              <div className="flex-1 max-w-2xl space-y-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="text-amber-500">Join Our</span>{' '}
                    <span className="text-zinc-100">Community</span>
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-zinc-400">
                    Connect with passionate creators, share ideas, and be part of something extraordinary. Our community is a vibrant space where technology enthusiasts, developers, and innovators come together to learn, share, and grow.
                  </p>
                  <div className="mt-4 text-sm text-zinc-500">
                    Join us in building a collaborative environment where knowledge flows freely and connections are made that last a lifetime. Whether you're here to learn, teach, or simply explore, there's a place for you in our community.
                  </div>
                </div>

                {/* Featured Member */}
                <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-amber-500">Featured</span>{' '}
                          <span className="text-zinc-100">Member</span>
                        </CardTitle>
                        <CardDescription>Recognizing outstanding community contributions</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Champion
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-zinc-800/50">
                          <AvatarImage src="/avatars/featured-member.jpg" />
                          <AvatarFallback className="bg-amber-500/10 text-amber-500">JD</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium text-zinc-100">Jane Doe</h3>
                          <Crown className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-sm text-zinc-400">@janedoe</p>
                        <p className="text-sm text-zinc-500 mt-1">Full-stack developer passionate about building accessible web applications and mentoring others.</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-zinc-100">Top Contributor</span>
                            <span className="text-xs text-zinc-500">3 months running</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-zinc-100">Most Helpful</span>
                            <span className="text-xs text-zinc-500">500+ solutions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mt-3 pt-3 border-t border-zinc-800/50">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>2.4k messages</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4" />
                        <span>5.2k reactions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Grid */}
              <div className="w-full lg:w-auto lg:flex-1 flex flex-col h-full">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-3 w-3 rounded-full bg-emerald-500/20" />
                          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-500">{stats.onlineMembers}</p>
                          <p className="text-sm text-zinc-400">Online Now</p>
                          <p className="text-xs text-zinc-500 mt-1">Active members in real-time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-2xl font-bold text-amber-500">{stats.totalMembers}</p>
                          <p className="text-sm text-zinc-400">Members</p>
                          <p className="text-xs text-zinc-500 mt-1">Growing community of creators</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-blue-500">{stats.activeDiscussions}</p>
                          <p className="text-sm text-zinc-400">Active</p>
                          <p className="text-xs text-zinc-500 mt-1">Ongoing conversations today</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Flame className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold text-red-500">12</p>
                          <p className="text-sm text-zinc-400">Trending</p>
                          <p className="text-xs text-zinc-500 mt-1">Hot topics right now</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Inspiration */}
                <div className="flex-1 flex flex-col mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold">
                        <span className="text-amber-500">Daily</span>{' '}
                        <span className="text-zinc-100">Inspiration</span>
                      </h2>
                      <p className="text-sm text-zinc-400">Words that move our community forward, carefully curated to inspire and motivate.</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Updated Daily
                    </Badge>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <QuoteCarousel initialQuotes={stats.quotes} className="flex-1 flex flex-col" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8 mt-8">
              {/* Left Column: Getting Started */}
              <div>
                <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-zinc-100">Getting Started</span>
                        </CardTitle>
                        <CardDescription>Your journey to becoming an active community member</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-amber-500">1</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-zinc-100">Complete Profile</h3>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-4 flex-shrink-0" />
                          </div>
                          <p className="text-sm text-zinc-500 mt-1">Set up your profile to help others find and connect with you.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-amber-500">2</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-zinc-100">Join Discussions</h3>
                            <Button variant="link" className="px-0 h-auto py-0 text-amber-500 hover:text-amber-400">
                              <span className="text-sm">Browse Discussions</span>
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                          <p className="text-sm text-zinc-500 mt-1">Share knowledge and engage with other members in meaningful conversations.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-amber-500">3</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-zinc-100">Explore Features</h3>
                            <Button variant="link" className="px-0 h-auto py-0 text-amber-500 hover:text-amber-400">
                              <span className="text-sm">View Features</span>
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                          <p className="text-sm text-zinc-500 mt-1">Discover our chat, forums, blog posts, and events features.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Live Activity */}
              <div>
                <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-amber-500" />
                          <span className="text-zinc-100">Live Activity</span>
                        </CardTitle>
                        <CardDescription>Latest community happenings</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Real-time
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <PartyPopper className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-zinc-100">New Workshop Announced</span>
                            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px]">Live</Badge>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">TypeScript Best Practices - Join Now</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-zinc-100">Active Discussion</span>
                            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500 text-[10px]">Hot</Badge>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">API Design Patterns - 15 participants</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-zinc-100">Featured Blog Post</span>
                            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-500 text-[10px]">New</Badge>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">Getting Started with Next.js</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 