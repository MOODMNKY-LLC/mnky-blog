import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { BlogPost } from '@/lib/notion/client';
import { cn } from '@/lib/utils';

interface LatestPostsSidebarProps {
  posts: BlogPost[];
  currentPostId?: string;
}

export function LatestPostsSidebar({ posts, currentPostId }: LatestPostsSidebarProps) {
  return (
    <div className="sticky top-24">
      <div className="glass glass-hover rounded-lg p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          Latest posts
        </h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={cn(
                "group block",
                currentPostId === post.id && "pointer-events-none"
              )}
            >
              <article className={cn(
                "flex gap-4 items-start p-2 -mx-2 rounded-lg transition-all duration-300",
                currentPostId === post.id
                  ? "bg-muted/80 backdrop-blur-sm"
                  : "hover:bg-muted/60 hover:backdrop-blur-sm hover:scale-[1.02] hover:shadow-sm"
              )}>
                {post.coverImage && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-medium leading-snug line-clamp-2 mb-1",
                    currentPostId === post.id
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-muted-foreground"
                  >
                    {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 