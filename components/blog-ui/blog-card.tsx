'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { BlogPost } from '@/lib/notion/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Markdown } from '@/components/ui/markdown';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  
  // Calculate animation duration based on content height
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const viewportHeight = 128; // h-32 = 8 * 4 = 32rem = 128px
      const scrollDistance = contentHeight - viewportHeight;
      // Speed: roughly 30 pixels per second
      const duration = Math.max(scrollDistance / 30, 5);
      setAnimationDuration(duration);
    }
  }, [post.content]);

  // Safely format the date, falling back to a placeholder if invalid
  const formattedDate = post.publishedAt ? format(parseISO(post.publishedAt), 'MMMM d, yyyy') : 'Date unavailable';

  return (
    <article 
      className="group relative flex overflow-hidden rounded-lg glass hover:glass-hover hover-lift"
      onMouseEnter={() => setShouldAnimate(true)}
      onMouseLeave={() => setShouldAnimate(false)}
    >
      {/* Image Section */}
      {post.coverImage && (
        <div className="relative w-48 flex-none">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={192}
            height={192}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category and Date */}
        <div className="flex items-center gap-x-4 text-xs">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.toLowerCase()}`}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {post.category}
            </Link>
          )}
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formattedDate}
          </time>
        </div>

        {/* Title and Excerpt */}
        <div className="group relative mt-3">
          <h3 className="text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Content Preview */}
        {post.content && (
          <div className="relative mt-4 flex-1">
            <ScrollArea className="h-32 rounded border border-border/50">
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

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
} 