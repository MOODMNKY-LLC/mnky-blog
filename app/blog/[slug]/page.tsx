import { notFound } from 'next/navigation';
import { getBlogPost, getPublishedBlogPosts } from '@/lib/notion/client';
import { BlogHero } from '@/components/blog-ui/blog-hero';
import { BlogContent } from '@/components/blog-ui/blog-content';
import { Suspense } from 'react';
import { PostSkeleton } from './loading';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const { posts } = await getPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function BlogPost({ slug }: { slug: string }) {
  try {
    const [post, { posts: latestPosts }] = await Promise.all([
      getBlogPost(slug),
      getPublishedBlogPosts({
        pageSize: 6,
        sorts: [{ property: 'Publish Date', direction: 'descending' }]
      })
    ]);
    
    if (!post) {
      notFound();
    }

    // Filter out the current post from latest posts
    const filteredLatestPosts = latestPosts.filter(p => p.id !== post.id);

    return (
      <article className="relative pb-16">
        <BlogHero post={post} />
        <BlogContent post={post} latestPosts={filteredLatestPosts} />
      </article>
    );
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    notFound();
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <Suspense fallback={<PostSkeleton />}>
      <BlogPost slug={slug} />
    </Suspense>
  );
} 