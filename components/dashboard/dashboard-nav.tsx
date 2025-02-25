'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  ReaderIcon,
  ChatBubbleIcon,
  ImageIcon,
  PersonIcon,
  GearIcon,
  RocketIcon,
  BellIcon,
} from '@radix-ui/react-icons'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Notes',
    href: '/dashboard/notes',
    icon: ReaderIcon,
  },
  {
    name: 'Discussions',
    href: '/dashboard/discussions',
    icon: ChatBubbleIcon,
  },
  {
    name: 'Media',
    href: '/dashboard/media',
    icon: ImageIcon,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: PersonIcon,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: GearIcon,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-gradient-to-b from-background/80 to-background/50 backdrop-blur-xl">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link 
          href="/dashboard" 
          className="mr-8 flex items-center gap-2 transition-colors hover:text-amber-500"
        >
          <RocketIcon className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-wider text-gradient-gold animate-text-shimmer">
            Dashboard
          </span>
        </Link>

        {/* Main Navigation */}
        <div className="flex flex-1 items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative px-4 py-1.5 text-sm font-medium transition-colors',
                  'hover:text-amber-500',
                  isActive 
                    ? 'text-amber-500' 
                    : 'text-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-amber-500 hover:bg-amber-500/10">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
            </span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent" />

          {/* Theme & Settings Links can be added here */}
        </div>
      </div>
    </nav>
  )
} 