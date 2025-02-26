import { getPublishedBlogPosts } from '@/lib/notion/client';
import { Hero } from '@/components/hero';
import { ArrowRight, BookOpen, Users, Sparkles } from 'lucide-react';
import { LatestPost } from '@/components/blog-ui/latest-post';
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const { posts } = await getPublishedBlogPosts({
    pageSize: 10,
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
    includeContent: true
  });

  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <main className="page-root">
      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-12">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="relative -mt-8">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BentoGrid className="grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured Story */}
            {latestPost && (
              <BentoCard
                name="Featured Story"
                className="col-span-1 lg:col-span-3 min-h-[36rem]"
                background={<LatestPost post={latestPost} />}
                Icon={Sparkles}
                description={
                  <span className="text-sm text-muted-foreground tracking-wider">
                    Dive into our latest exploration of ideas and insights
                  </span>
                }
                href={`/blog/${latestPost.slug}`}
                cta={
                  <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                }
              />
            )}

            {/* Right Side Cards Stack */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 gap-6">
              {/* Knowledge Library */}
              <BentoCard
                name="Knowledge Library"
                className="min-h-[11rem]"
                background={
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </div>
                }
                Icon={BookOpen}
                description={
                  <span className="text-sm text-muted-foreground tracking-wider">
                    Curated collection of articles, videos, and essential resources
                  </span>
                }
                href="/library"
                cta={
                  <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                    Browse Library
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                }
              />

              {/* Community Hub */}
              <BentoCard
                name="Community Hub"
                className="min-h-[11rem]"
                background={
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </div>
                }
                Icon={Users}
                description={
                  <span className="text-sm text-muted-foreground tracking-wider">
                    Connect with fellow enthusiasts and join the conversation
                  </span>
                }
                href="/community"
                cta={
                  <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                    Join Community
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                }
              />

              {/* Latest Insights */}
              <BentoCard
                name="Latest Insights"
                className="min-h-[11rem]"
                background={
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </div>
                }
                Icon={Sparkles}
                description={
                  <span className="text-sm text-muted-foreground tracking-wider">
                    Fresh perspectives and trending discussions from our community
                  </span>
                }
                href="/blog"
                cta={
                  <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                    Read Blog
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                }
              />
            </div>

            {/* Recent Stories Section - Full Width */}
            <div className="col-span-1 lg:col-span-5 space-y-6">
              {/* Recent Stories Header */}
              <BentoCard
                name="Recent Stories"
                className="min-h-[8rem]"
                background={
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </div>
                }
                Icon={Sparkles}
                description={
                  <span className="text-sm text-muted-foreground tracking-wider">
                    Discover the latest thoughts and insights from our community
                  </span>
                }
                href="/blog"
                cta={
                  <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                    View All Posts
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                }
              />

              {/* Recent Story Cards */}
              <div className="relative overflow-hidden">
                <div className="flex animate-carousel hover:pause-animation">
                  {/* First set of cards */}
                  {[...Array(3)].map((_, index) => {
                    const post = recentPosts[index];
                    return post ? (
                      <div key={post.id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                        <div className="px-2">
                          <BentoCard
                            name={post.title}
                            className="min-h-[20rem]"
                            background={
                              <div className="absolute inset-0">
                                {post.coverImage ? (
                                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                                )}
                                <div className="absolute -left-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                                <div className="absolute -right-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                              </div>
                            }
                            Icon={Sparkles}
                            description={
                              <span className="text-sm text-muted-foreground tracking-wider line-clamp-3">
                                {post.excerpt}
                              </span>
                            }
                            href={`/blog/${post.slug}`}
                            cta={
                              <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                                Read Post
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={`skeleton-${index}`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                        <div className="px-2">
                          <BentoCard
                            name="More Stories Coming"
                            className="min-h-[20rem] opacity-70 hover:opacity-100 transition-opacity"
                            background={
                              <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur">
                                  <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#000000,45%,#1a1a1a,55%,#000000)] bg-[length:200%_100%]" />
                                </div>
                                <div className="absolute -left-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                                <div className="absolute -right-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                              </div>
                            }
                            Icon={Sparkles}
                            description={
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground/80">
                                  We&apos;re crafting new stories to inspire and engage. Check back soon for fresh perspectives and insights.
                                </p>
                                <div className="space-y-2">
                                  <div className="h-2 w-2/3 bg-muted-foreground/20 rounded animate-pulse" />
                                  <div className="h-2 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                                </div>
                              </div>
                            }
                            href="/blog"
                            cta={
                              <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold opacity-80">
                                Browse Existing Stories
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* Duplicate set for seamless loop */}
                  {[...Array(3)].map((_, index) => {
                    const post = recentPosts[index];
                    return post ? (
                      <div key={`${post.id}-duplicate`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                        <div className="px-2">
                          <BentoCard
                            name={post.title}
                            className="min-h-[20rem]"
                            background={
                              <div className="absolute inset-0">
                                {post.coverImage ? (
                                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur" />
                                )}
                                <div className="absolute -left-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                                <div className="absolute -right-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                              </div>
                            }
                            Icon={Sparkles}
                            description={
                              <span className="text-sm text-muted-foreground tracking-wider line-clamp-3">
                                {post.excerpt}
                              </span>
                            }
                            href={`/blog/${post.slug}`}
                            cta={
                              <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold">
                                Read Post
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={`skeleton-${index}-duplicate`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                        <div className="px-2">
                          <BentoCard
                            name="More Stories Coming"
                            className="min-h-[20rem] opacity-70 hover:opacity-100 transition-opacity"
                            background={
                              <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-transparent backdrop-blur">
                                  <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#000000,45%,#1a1a1a,55%,#000000)] bg-[length:200%_100%]" />
                                </div>
                                <div className="absolute -left-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                                <div className="absolute -right-[1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                              </div>
                            }
                            Icon={Sparkles}
                            description={
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground/80">
                                  We&apos;re crafting new stories to inspire and engage. Check back soon for fresh perspectives and insights.
                                </p>
                                <div className="space-y-2">
                                  <div className="h-2 w-2/3 bg-muted-foreground/20 rounded animate-pulse" />
                                  <div className="h-2 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                                </div>
                              </div>
                            }
                            href="/blog"
                            cta={
                              <span className="flex items-center gap-2 text-sm font-semibold text-gradient-gold opacity-80">
                                Browse Existing Stories
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </BentoGrid>
        </div>
      </section>
    </main>
  );
}
