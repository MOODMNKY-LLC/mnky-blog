import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import { BlogPost } from '@/lib/notion/client';
import { cn } from '@/lib/utils';

interface BlogHeroProps {
  post: BlogPost;
  heroOverlay?: 'none' | 'light' | 'dark' | 'gradient';
}

export function BlogHero({ post, heroOverlay = 'gradient' }: BlogHeroProps) {
  const formattedDate = post.publishedAt 
    ? format(parseISO(post.publishedAt), 'MMMM d, yyyy') 
    : 'Date unavailable';

  const overlayClasses = {
    none: '',
    light: 'bg-background/50 backdrop-blur-sm',
    dark: 'bg-background/80 backdrop-blur-sm',
    gradient: 'bg-gradient-to-b from-background/5 via-background/50 to-background'
  };

  return (
    <div className="relative w-full min-h-[50vh] flex items-center justify-center -mt-24">
      {/* Background Image */}
      {(post.heroBackground || post.coverImage) && (
        <div className="absolute inset-0 z-0">
          <Image
            src={post.heroBackground || post.coverImage!}
            alt={post.title}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
            quality={100}
          />
        </div>
      )}
      
      {/* Overlay */}
      <div className={cn(
        "absolute inset-0 z-1",
        overlayClasses[heroOverlay]
      )} />

      {/* Content */}
      <div className="relative z-2 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="flex flex-col items-center text-center">
          {/* Category */}
          {post.category ? (
            <Link
              href={`/blog/category/${post.category.toLowerCase()}`}
              className="mb-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {post.category}
            </Link>
          ) : post.tags[0] && (
            <Link
              href={`/blog/category/${post.tags[0].toLowerCase()}`}
              className="mb-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {post.tags[0]}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/90 max-w-2xl mb-8 drop-shadow">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-white/80">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{post.author}</span>
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
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 