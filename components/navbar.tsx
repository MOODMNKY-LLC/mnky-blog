'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'
import { Menu, User, Settings, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Search } from './search'
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { signOut } from '@/app/actions'

interface NavbarProps {
  user: {
    email?: string
    fullName?: string
    avatarUrl?: string
  } | null
  isAuthenticated: boolean
}

// Navigation items based on auth state
const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Categories', href: '/#categories' },
  { name: 'About', href: '/about' },
]

const privateNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Posts', href: '/dashboard/posts' },
]

export function Navbar({ user, isAuthenticated }: NavbarProps) {
  const pathname = usePathname()
  const navigation = isAuthenticated ? privateNavigation : publicNavigation

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
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
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
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
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
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                          <AvatarFallback>
                            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
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