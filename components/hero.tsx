'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Bell, Zap } from 'lucide-react'

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center py-16 sm:py-20">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-widest text-gradient-gold animate-text-shimmer">
            MNKY
          </span>
          <div className="flex items-center gap-4 mt-2">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <span className="text-xl sm:text-2xl font-medium text-muted-foreground tracking-[0.5em] uppercase">
              Blog
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground tracking-widest uppercase">
          A Journal of Thought & Connection
        </p>
      </div>
      
      <div className="text-center">
        <h1 className="sr-only">MNKY BLOG - A Journal of Thought & Connection</h1>
        <p className="text-2xl sm:text-3xl lg:text-4xl !leading-tight mx-auto max-w-2xl text-center">
          A space where{' '}
          <span className="font-bold text-gradient-gold">scent</span>,{' '}
          <span className="font-bold text-gradient-gold">sound</span>, and{' '}
          <span className="font-bold text-gradient-gold">self-reflection</span>{' '}
          intertwine
        </p>
      </div>

      {/* Dynamic Updates Section - Replaces buttons */}
      <div className="w-full max-w-3xl mx-auto relative">
        {/* Top Gradient Border */}
        <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="overflow-hidden">
          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling Content */}
          <div className="flex items-center py-3">
            <div className="flex items-center gap-12 animate-scroll-x hover:pause-animation">
              {/* First Set */}
              <Link href="/blog" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">Latest Stories</span>
                  <span className="text-muted-foreground text-xs">Explore Our Latest Articles</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>

              <Link href="/community" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">Join Community</span>
                  <span className="text-muted-foreground text-xs">Connect with MNKY Family</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>

              <Link href="/scents" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">New Collection</span>
                  <span className="text-muted-foreground text-xs">Discover Latest Fragrances</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>

              {/* Duplicate Set */}
              <Link href="/blog" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">Latest Stories</span>
                  <span className="text-muted-foreground text-xs">Explore Our Latest Articles</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>

              <Link href="/community" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">Join Community</span>
                  <span className="text-muted-foreground text-xs">Connect with MNKY Family</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>

              <Link href="/scents" className="flex items-center gap-3 text-sm whitespace-nowrap group hover:opacity-80 transition-opacity">
                <div className="p-1.5 rounded-md bg-primary/10 text-gradient-gold">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gradient-gold">New Collection</span>
                  <span className="text-muted-foreground text-xs">Discover Latest Fragrances</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gradient-gold" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Border */}
        <div className="absolute -bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </div>
  )
} 