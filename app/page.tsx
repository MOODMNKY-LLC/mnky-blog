import { getPublishedBlogPosts } from '@/lib/notion/client';
import { BlogGrid } from '@/components/blog-ui/blog-grid';
import { Hero } from '@/components/hero';
import Link from 'next/link';
import { ArrowRight, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LatestPost } from '@/components/blog-ui/latest-post';
import { CategoryTabs } from '@/components/blog-ui/category-tabs';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const { posts } = await getPublishedBlogPosts({
    pageSize: 10,
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
    includeContent: true
  });

  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  // Get unique categories from all posts
  const categories = Array.from(new Set(posts.flatMap(post => post.category ? [post.category] : [])));

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
      </section>

      {/* Latest Post */}
      {latestPost && (
        <section className="relative -mt-40 pb-4 sm:pb-6">
          <div className="absolute inset-0 bg-muted/30 backdrop-blur-[2px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-6 pt-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Latest Story
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore our most recent insights and discoveries
              </p>
            </div>
            <LatestPost post={latestPost} />
          </div>
        </section>
      )}

      {/* Category Navigation */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Browse by Category
              </h2>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <SortDesc className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>
            <CategoryTabs categories={categories} />
          </div>
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="relative py-6 sm:py-8">
        <div className="absolute inset-0 bg-muted/30 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Recent Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Dive into our collection of thought-provoking articles
            </p>
          </div>
          <BlogGrid posts={recentPosts} />
          <div className="mt-6 text-center">
            <Button asChild>
              <Link href="/blog/archive" className="gap-2">
                View All Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
