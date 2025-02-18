import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { BlogPost } from '@/lib/notion/client';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Safely format the date, falling back to a placeholder if invalid
  const formattedDate = post.publishedAt ? format(parseISO(post.publishedAt), 'MMMM d, yyyy') : 'Date unavailable';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg glass hover:glass-hover hover-lift">
      {post.coverImage && (
        <div className="aspect-[16/9] bg-muted sm:aspect-[2/1] lg:aspect-[3/2] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={600}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <div className="flex items-center gap-x-4 text-xs">
            <time dateTime={post.publishedAt} className="text-muted-foreground">
              {formattedDate}
            </time>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="relative z-10 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="group relative mt-3">
            <h3 className="text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>
                <span className="absolute inset-0" />
                {post.title}
              </Link>
            </h3>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </div>
        {post.author && (
          <div className="relative mt-8 flex items-center gap-x-4">
            <div className="text-sm leading-6">
              <p className="font-semibold text-foreground">
                <span className="absolute inset-0" />
                {post.author}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
} 