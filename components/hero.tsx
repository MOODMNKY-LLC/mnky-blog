'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center py-24 sm:py-32">
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

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Link
          href="#featured"
          className="glass hover:glass-hover rounded-md px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group"
        >
          Explore Posts
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="#categories"
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
        >
          View Categories
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  )
} 