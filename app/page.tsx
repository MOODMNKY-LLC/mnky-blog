import { getPublishedBlogPosts } from '@/lib/notion/client';
import { BlogGrid } from '@/components/blog-ui/blog-grid';
import { Hero } from '@/components/hero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const { posts } = await getPublishedBlogPosts();
  const featuredPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(3, 9);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
      </section>

      {/* Featured Posts */}
      <section id="featured" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-muted/30 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Dive into our most impactful narratives, where technology meets humanity 
              and innovation sparks conversation.
            </p>
          </div>
          <BlogGrid posts={featuredPosts} />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore Topics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Journey through our diverse collection of insights and experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative overflow-hidden rounded-lg glass hover:glass-hover hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                <div className="relative aspect-[4/3] p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                  <div className="mt-4 flex items-center text-primary">
                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Explore
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-muted/30 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Latest Insights
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stay updated with our newest perspectives and discoveries.
            </p>
          </div>
          <BlogGrid posts={recentPosts} />
        </div>
      </section>
    </main>
  );
}

const categories = [
  {
    title: 'The Art of Scent',
    description: 'Explore the science and psychology of fragrance, and how it shapes our experiences.',
    href: '/blog/category/scent',
  },
  {
    title: 'Stories from the Fringes',
    description: 'Narratives of resilience, reinvention, and unapologetic self-expression.',
    href: '/blog/category/stories',
  },
  {
    title: 'Technology & Connection',
    description: 'Where innovation meets human experience in the digital age.',
    href: '/blog/category/tech',
  },
  {
    title: 'Gaming & Digital Culture',
    description: 'Exploring identity and community in virtual worlds.',
    href: '/blog/category/gaming',
  },
  {
    title: 'Philosophy & Mental Health',
    description: 'Perspectives on personal growth, mindfulness, and self-discovery.',
    href: '/blog/category/philosophy',
  },
  {
    title: 'Creative Expression',
    description: 'Art, music, and the many ways we make meaning.',
    href: '/blog/category/creativity',
  },
];
