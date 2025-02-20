import { BlogPost } from '@/lib/notion/client';
import { Markdown } from '@/components/ui/markdown';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionButtons } from './action-buttons';
import { LatestPostsSidebar } from './latest-posts-sidebar';

interface BlogContentProps {
  post: NonNullable<BlogPost>;
  latestPosts: BlogPost[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
  items: TocItem[];
}

function TableOfContentsItem({ item }: { item: TocItem }) {
  return (
    <li>
      <a
        href={`#${item.id}`}
        className={cn(
          "group flex items-center py-1 text-muted-foreground transition-colors",
          "hover:text-foreground",
          item.level === 1 && "font-medium text-foreground",
          item.level > 1 && "pl-4",
          item.level > 2 && "pl-8"
        )}
      >
        <span className="mr-2 h-1 w-1 rounded-full bg-muted-foreground/80 transition-colors group-hover:bg-primary" />
        <span className="text-sm transition-colors group-hover:text-foreground">
          {item.text}
        </span>
      </a>
      {item.items.length > 0 && (
        <ul className="mt-2 space-y-2 border-l border-border/50">
          {item.items.map((child) => (
            <TableOfContentsItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function BlogContent({ post, latestPosts }: BlogContentProps) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center">
          {/* Table of Contents (if available) */}
          {post.tableOfContents && post.tableOfContents.length > 0 && (
            <div className="hidden xl:block w-64 flex-none">
              <div className="sticky top-24 pr-8">
                <div className="glass rounded-lg overflow-hidden">
                  {/* ToC Header */}
                  <div className="px-6 py-4 border-b border-border/50 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold tracking-wide text-foreground">
                        ON THIS PAGE
                      </h2>
                      <span className="text-xs font-medium text-muted-foreground">
                        {post.tableOfContents.length} sections
                      </span>
                    </div>
                  </div>
                  
                  {/* ToC Content */}
                  <nav className="p-6">
                    <ul className="space-y-4 text-sm">
                      {post.tableOfContents.map((item) => (
                        <TableOfContentsItem key={item.id} item={item} />
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Container with Dividers */}
          <div className="w-full max-w-3xl relative">
            {/* Left Divider */}
            <div className="hidden xl:block absolute -left-px top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border/80 to-transparent" />
            
            {/* Right Divider */}
            <div className="hidden xl:block absolute -right-px top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border/80 to-transparent" />

            {/* Actions Bar */}
            <div className="sticky top-24 z-20 backdrop-blur-sm bg-background/80 py-2 px-8 -mx-8 sm:mx-0 sm:px-8 mb-4">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>
                </Button>
                <ActionButtons post={post} />
              </div>
            </div>

            {/* Main Content with Padding */}
            <article className="relative px-8">
              {/* Content */}
              <div className={cn(
                "prose prose-zinc dark:prose-invert max-w-none",
                // Custom Notion-like typography
                "prose-headings:scroll-mt-24 prose-headings:font-display",
                "prose-h1:text-3xl prose-h1:font-bold",
                "prose-h2:text-2xl prose-h2:font-semibold",
                "prose-h3:text-xl prose-h3:font-semibold",
                "prose-h4:text-lg prose-h4:font-semibold",
                // Links
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                // Lists
                "prose-ul:list-disc prose-ol:list-decimal",
                // Code blocks
                "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
                // Inline code
                "prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
                // Quotes
                "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic",
                // Images
                "prose-img:rounded-lg prose-img:border prose-img:border-border",
                // Tables
                "prose-table:border prose-table:border-border",
                "prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-border",
                "prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border",
              )}>
                <Markdown>{post.content || ''}</Markdown>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase()}`}
                        className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio (if available) */}
              {post.author && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        Written by {post.author}
                      </h3>
                      {post.authorBio && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {post.authorBio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Latest Posts Sidebar */}
          <div className="hidden xl:block w-64 flex-none">
            <div className="sticky top-24 pl-8">
              <LatestPostsSidebar posts={latestPosts} currentPostId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 