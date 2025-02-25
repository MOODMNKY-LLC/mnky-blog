import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  PlusIcon, 
  GlobeIcon, 
  GitHubLogoIcon, 
  TwitterLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  DiscordLogoIcon,
  ReaderIcon,
  ChatBubbleIcon,
  ImageIcon,
  EnvelopeClosedIcon,
  DrawingPinIcon,
  CalendarIcon,
  ClockIcon,
  GearIcon,
  PersonIcon,
  CodeIcon,
  MixIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProfileAvatar } from "@/components/dashboard/profile-avatar"

async function getDashboardData() {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Get user profile data with all fields
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get activity counts
  const { count: notesCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: repliesCount } = await supabase
    .from('forum_replies')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: messagesCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('read', false)

  const { count: mediaCount } = await supabase
    .from('media')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return {
    user,
    profile,
    activityCounts: {
      notes: notesCount || 0,
      replies: repliesCount || 0,
      unreadMessages: messagesCount || 0,
      media: mediaCount || 0
    }
  }
}

export default async function DashboardPage() {
  const { profile, activityCounts } = await getDashboardData()

  const socialLinks = [
    {
      icon: <GlobeIcon className="h-4 w-4" />,
      href: profile?.website,
      label: "Website"
    },
    {
      icon: <GitHubLogoIcon className="h-4 w-4" />,
      href: profile?.preferences?.social?.github && `https://github.com/${profile.preferences.social.github}`,
      label: "GitHub"
    },
    {
      icon: <TwitterLogoIcon className="h-4 w-4" />,
      href: profile?.preferences?.social?.twitter && `https://twitter.com/${profile.preferences.social.twitter}`,
      label: "Twitter"
    },
    {
      icon: <InstagramLogoIcon className="h-4 w-4" />,
      href: profile?.preferences?.social?.instagram && `https://instagram.com/${profile.preferences.social.instagram}`,
      label: "Instagram"
    },
    {
      icon: <LinkedInLogoIcon className="h-4 w-4" />,
      href: profile?.preferences?.social?.linkedin && `https://linkedin.com/in/${profile.preferences.social.linkedin}`,
      label: "LinkedIn"
    },
    {
      icon: <DiscordLogoIcon className="h-4 w-4" />,
      href: profile?.preferences?.social?.discord,
      label: "Discord"
    }
  ]

  const profileCards = [
    {
      title: "Personal Information",
      icon: <PersonIcon className="h-5 w-5 text-amber-500" />,
      href: "/dashboard/profile/personal",
      description: "Update your profile details and preferences",
      items: [
        { label: "Full Name", value: profile?.full_name },
        { label: "Username", value: `@${profile?.username}` },
        { label: "Email", value: profile?.email },
        { label: "Bio", value: profile?.bio || "No bio added" }
      ]
    },
    {
      title: "Agent Configuration",
      icon: <RocketIcon className="h-5 w-5 text-amber-500" />,
      href: "/dashboard/profile/agent",
      description: "Customize your personal AI assistant",
      items: [
        { label: "Agent Name", value: profile?.preferences?.agent?.name || "MNKY Assistant" },
        { label: "Personality", value: profile?.preferences?.agent?.personality || "Professional" },
        { label: "Expertise", value: profile?.preferences?.agent?.expertise?.join(", ") || "General" }
      ]
    },
    {
      title: "System Instructions",
      icon: <CodeIcon className="h-5 w-5 text-amber-500" />,
      href: "/dashboard/profile/instructions",
      description: "Define custom behavior and preferences",
      items: [
        { label: "Custom Rules", value: `${profile?.preferences?.agent?.rules?.length || 0} rules defined` },
        { label: "Templates", value: `${profile?.preferences?.agent?.templates?.length || 0} templates` },
        { label: "Last Updated", value: profile?.preferences?.agent?.updatedAt || "Never" }
      ]
    },
    {
      title: "Integration Settings",
      icon: <MixIcon className="h-5 w-5 text-amber-500" />,
      href: "/dashboard/profile/integrations",
      description: "Manage connected services and APIs",
      items: [
        { label: "Connected Apps", value: `${Object.keys(profile?.preferences?.social || {}).length} services` },
        { label: "API Keys", value: "••• Configure" },
        { label: "Webhooks", value: profile?.preferences?.webhooks?.length || 0 }
      ]
    }
  ]

  const activityCards = [
    {
      title: "Notes",
      icon: <ReaderIcon className="h-5 w-5 text-amber-500" />,
      count: activityCounts.notes,
      href: "/dashboard/notes",
      description: "Review and manage your personal notes",
      action: "View Notes"
    },
    {
      title: "Forum Replies",
      icon: <ChatBubbleIcon className="h-5 w-5 text-amber-500" />,
      count: activityCounts.replies,
      href: "/dashboard/replies",
      description: "Track your forum discussions and replies",
      action: "View Replies"
    },
    {
      title: "Messages",
      icon: <EnvelopeClosedIcon className="h-5 w-5 text-amber-500" />,
      count: activityCounts.unreadMessages,
      href: "/dashboard/messages",
      description: "Check your inbox and conversations",
      action: "Open Inbox",
      badge: activityCounts.unreadMessages > 0 ? "Unread" : undefined
    },
    {
      title: "Media",
      icon: <ImageIcon className="h-5 w-5 text-amber-500" />,
      count: activityCounts.media,
      href: "/dashboard/media",
      description: "Manage your images, videos, and audio files",
      action: "View Media"
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardNav />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section with Profile */}
        <div className="grid gap-6 md:grid-cols-[1fr_300px] mb-12">
          {/* Welcome Card */}
          <div className="rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
                    Welcome back, {profile?.full_name || 'Creator'}
                  </h1>
                  <p className="text-lg text-zinc-400">
                    Your personal space for notes, discussions, and creativity.
        </p>
      </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <DrawingPinIcon className="h-4 w-4 text-amber-500" />
                    {activityCounts.notes} Note{activityCounts.notes !== 1 && 's'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <ChatBubbleIcon className="h-4 w-4 text-amber-500" />
                    {activityCounts.replies} Repl{activityCounts.replies !== 1 ? 'ies' : 'y'}
                  </div>
                  {activityCounts.unreadMessages > 0 && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <EnvelopeClosedIcon className="h-4 w-4 text-amber-500" />
                      {activityCounts.unreadMessages} Unread Message{activityCounts.unreadMessages !== 1 && 's'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <ProfileAvatar 
                  avatarPath={profile?.avatar_url}
                  fullName={profile?.full_name}
                  size="lg"
                />
                <div className="space-y-1.5 mb-4">
                  <h2 className="text-xl font-semibold text-zinc-100">{profile?.full_name}</h2>
                  <p className="text-sm text-zinc-400">@{profile?.username}</p>
                </div>
                {profile?.bio && (
                  <p className="text-sm text-zinc-400 mb-4">
                    {profile.bio}
                  </p>
                )}
                <Separator className="mb-4 bg-zinc-800/50" />
                <div className="grid grid-cols-3 gap-2 w-full">
                  {socialLinks.map((link, index) => 
                    link.href ? (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="w-full h-9 relative group border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500"
                        asChild
                      >
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative"
                        >
                          {link.icon}
                          <span className="sr-only">{link.label}</span>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-amber-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {link.label}
                          </span>
                        </a>
                      </Button>
                    ) : null
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {activityCards.map((card, index) => (
            <Card key={index} className="group border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {card.icon}
                  {card.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors">
                  {card.title}
                </CardTitle>
                <p className="text-sm text-zinc-400">{card.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Last activity: 2h ago</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 -mr-2"
                    asChild
                  >
                    <a href={card.href}>{card.action}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Settings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-100">Profile & Settings</h2>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500">
              <GearIcon className="mr-2 h-4 w-4" />
              Manage All Settings
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {profileCards.map((card, index) => (
              <Card key={index} className="group border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {card.icon}
                    <CardTitle className="text-lg font-semibold text-zinc-100 group-hover:text-amber-500 transition-colors">
                      {card.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-zinc-400">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {card.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="text-zinc-100 font-medium">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-4">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                        asChild
                      >
                        <a href={card.href}>Configure Settings</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-100">Recent Activity</h2>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-amber-500">
              View All Activity
            </Button>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 divide-y divide-zinc-800/50">
            <div className="p-4 flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ReaderIcon className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-100">Added a new note: &ldquo;Thoughts on Sensory Design&rdquo;</p>
                <p className="text-xs text-zinc-400">2 hours ago</p>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                View
              </Button>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ChatBubbleIcon className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-100">Replied to &ldquo;Digital Scent Technology&rdquo;</p>
                <p className="text-xs text-zinc-400">5 hours ago</p>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                View
              </Button>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-100">Added new media files</p>
                <p className="text-xs text-zinc-400">Yesterday</p>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                View
              </Button>
            </div>
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  )
}

