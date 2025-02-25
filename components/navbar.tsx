'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'
import { Menu, User, Settings, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Search } from './search'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { signOut } from '@/app/actions'
import { AvatarCircles } from './avatar-circles'
import { ChevronDown } from 'lucide-react'

interface NavbarProps {
  user: {
    email?: string
    fullName?: string
    avatarUrl?: string
  } | null
  isAuthenticated: boolean
}

interface NavigationItem {
  name: string
  href: string
  items?: NavigationItem[]
}

// Navigation items based on auth state
const publicNavigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Blog',
    href: '/blog',
    items: [
      { name: 'Latest Posts', href: '/blog' },
      { name: 'Categories', href: '/blog/categories' },
      { name: 'Archive', href: '/blog/archive' },
    ]
  },
  { 
    name: 'Library',
    href: '/library',
    items: [
      { name: 'Articles', href: '/library/articles' },
      { name: 'Videos', href: '/library/videos' },
      { name: 'Resources', href: '/library/resources' },
    ]
  },
  { 
    name: 'Community',
    href: '/community',
    items: [
      { name: 'Forum', href: '/community/forum' },
      { name: 'Discussions', href: '/community/discussions' },
      { name: 'Members', href: '/community/members' },
    ]
  },
  { 
    name: 'About',
    href: '/about',
    items: [
      { name: 'Mission', href: '/about/mission' },
      { name: 'Team', href: '/about/team' },
      { name: 'FAQ', href: '/about/faq' },
      { name: 'Contact', href: '/about/contact' },
    ]
  },
]

const privateNavigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Blog',
    href: '/blog',
    items: [
      { name: 'Latest Posts', href: '/blog' },
      { name: 'Categories', href: '/blog/categories' },
      { name: 'Archive', href: '/blog/archive' },
    ]
  },
  { 
    name: 'Library',
    href: '/library',
    items: [
      { name: 'Articles', href: '/library/articles' },
      { name: 'Videos', href: '/library/videos' },
      { name: 'Resources', href: '/library/resources' },
    ]
  },
  { 
    name: 'Community',
    href: '/community',
    items: [
      { name: 'Forum', href: '/community/forum' },
      { name: 'Discussions', href: '/community/discussions' },
      { name: 'Members', href: '/community/members' },
    ]
  },
  { name: 'Dashboard', href: '/dashboard' },
]

function NavItem({ 
  item, 
  isActive,
  pathname 
}: { 
  item: NavigationItem; 
  isActive: boolean;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (item.items) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href={item.href}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1',
            'hover:text-primary',
            isActive 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground'
          )}
        >
          {item.name}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Link>
        {isOpen && (
          <div className="absolute top-full left-0 pt-2 min-w-[12rem]">
            <div className="relative rounded-lg bg-popover shadow-md border p-2">
              <div className="absolute -top-1 left-6 w-2 h-2 rotate-45 bg-popover border-l border-t" />
              <div className="relative space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      pathname === subItem.href 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground'
                    )}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        'hover:text-primary',
        isActive 
          ? 'text-primary bg-primary/10' 
          : 'text-muted-foreground'
      )}
    >
      {item.name}
    </Link>
  )
}

function MobileNavItem({ 
  item, 
  isActive,
  pathname 
}: { 
  item: NavigationItem; 
  isActive: boolean;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (item.items) {
    return (
      <div className="flex flex-col">
        <Link
          href={item.href}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between',
            'hover:text-primary hover:bg-primary/10',
            isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
          )}
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(!isOpen)
          }}
        >
          {item.name}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Link>
        {isOpen && (
          <div className="ml-4 flex flex-col gap-1 mt-1">
            {item.items.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'hover:text-primary hover:bg-primary/10',
                  pathname === subItem.href ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                )}
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        'hover:text-primary hover:bg-primary/10',
        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
      )}
    >
      {item.name}
    </Link>
  )
}

export function Navbar({ user, isAuthenticated }: NavbarProps) {
  const pathname = usePathname()
  const navigation = isAuthenticated ? privateNavigation : publicNavigation
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading avatar:', error)
      }
    }

    if (user?.avatarUrl) {
      downloadImage(user.avatarUrl)
    }
  }, [user?.avatarUrl, supabase])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav className="relative flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-full glass">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-wider text-gradient-gold">
            MNKY
          </span>
          <span className="text-xl font-medium tracking-wide text-muted-foreground">
            BLOG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.items?.some(subItem => pathname === subItem.href) ?? false)
            return (
              <NavItem 
                key={item.name} 
                item={item} 
                isActive={isActive}
                pathname={pathname}
              />
            )
          })}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Search />
          <Link
            href="/rss"
            className="hidden md:inline-block text-muted-foreground hover:text-primary transition-colors"
          >
            RSS
          </Link>
          <div className="hidden md:block h-4 w-px bg-border" />
          <ThemeSwitcher />
          <div className="hidden md:block h-4 w-px bg-border" />
          
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    {avatarUrl ? (
                      <AvatarCircles
                        avatars={[
                          {
                            imageUrl: avatarUrl,
                            profileUrl: '/dashboard/profile'
                          }
                        ]}
                        size={36}
                        showLink={false}
                      />
                    ) : (
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form action={signOut}>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      asChild
                    >
                      <button className="w-full flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="glass-hover">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] glass">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="text-gradient-gold">MNKY</span>{' '}
                    <span className="text-muted-foreground">BLOG</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.items?.some(subItem => pathname === subItem.href) ?? false)
                    return (
                      <MobileNavItem 
                        key={item.name} 
                        item={item} 
                        isActive={isActive}
                        pathname={pathname}
                      />
                    )
                  })}
                  <div className="h-px bg-border my-2" />
                  <Link
                    href="/rss"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    RSS Feed
                  </Link>
                  <div className="h-px bg-border my-2" />
                  {/* Mobile Auth Section */}
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <div className="px-4 py-2 flex items-center gap-3">
                        {avatarUrl ? (
                          <AvatarCircles
                            avatars={[
                              {
                                imageUrl: avatarUrl,
                                profileUrl: '/dashboard/profile'
                              }
                            ]}
                            size={32}
                            showLink={false}
                          />
                        ) : (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium leading-none">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard/profile"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/auth/sign-in" className="px-4">Sign In</Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/auth/sign-up" className="px-4">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  )
} 