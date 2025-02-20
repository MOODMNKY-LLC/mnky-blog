'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/lib/notion/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Markdown } from '@/components/ui/markdown';
import { useRef, useEffect, useState } from 'react';

interface LatestPostProps {
  post: BlogPost;
}

export function LatestPost({ post }: LatestPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  
  // Calculate animation duration based on content height
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const viewportHeight = 160; // h-40 = 10 * 4 = 40rem = 160px
      const scrollDistance = contentHeight - viewportHeight;
      // Speed: roughly 30 pixels per second
      const duration = Math.max(scrollDistance / 30, 5);
      setAnimationDuration(duration);
    }
  }, [post.content]);

  const formattedDate = post.publishedAt
    ? format(parseISO(post.publishedAt), 'MMMM d, yyyy')
    : 'Date unavailable';

  return (
    <article 
      className="relative overflow-hidden rounded-xl glass hover:glass-hover transition-all duration-500"
      onMouseEnter={() => setShouldAnimate(true)}
      onMouseLeave={() => setShouldAnimate(false)}
    >
      <div className="lg:flex lg:items-center">
        {/* Image */}
        {post.coverImage && (
          <div className="lg:w-1/2 h-64 lg:h-96 relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "p-8 lg:p-12 lg:w-1/2",
          !post.coverImage && "lg:w-full"
        )}>
          {/* Category */}
          {post.category && (
            <Link
              href={`/blog/category/${post.category.toLowerCase()}`}
              className="inline-block mb-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {post.category}
            </Link>
          )}

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-6">
            {post.excerpt}
          </p>

          {/* Content Preview */}
          {post.content && (
            <div className="relative mb-8">
              <ScrollArea className="h-40 rounded border border-border/50">
                <div 
                  ref={contentRef}
                  className={cn(
                    "p-4 transition-transform duration-1000 ease-linear",
                    shouldAnimate && "animate-scroll"
                  )}
                  style={{
                    '--scroll-duration': `${animationDuration}s`,
                    animation: shouldAnimate 
                      ? `scroll ${animationDuration}s linear infinite`
                      : 'none'
                  } as React.CSSProperties}
                >
                  <div className={cn(
                    "prose prose-sm dark:prose-invert max-w-none",
                    "prose-headings:font-semibold prose-headings:text-foreground",
                    "prose-p:text-muted-foreground prose-p:leading-relaxed",
                    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                    "prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm",
                    "prose-pre:bg-muted/50 prose-pre:p-4"
                  )}>
                    <Markdown>{post.content}</Markdown>
                  </div>
                </div>
              </ScrollArea>
              {/* Fade effect at the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>

            {/* Reading Time */}
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <Button asChild>
            <Link href={`/blog/${post.slug}`} className="gap-2">
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
} 