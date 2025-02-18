'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Search } from './search'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Categories', href: '/#categories' },
  { name: 'About', href: '/about' },
]

export function Navbar() {
  const pathname = usePathname()

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
                  isActive ? 'text-primary' : 'text-muted-foreground'
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  )
} 