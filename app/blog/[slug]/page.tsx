import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { notFound } from 'next/navigation';
import { getBlogPost, getPublishedBlogPosts } from '@/lib/notion/client';
import { Markdown } from '@/components/ui/markdown';
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

function BlogPostContent({ post }: { post: Awaited<ReturnType<typeof getBlogPost>> }) {
  if (!post) return null;

  const formattedDate = post.publishedAt 
    ? format(parseISO(post.publishedAt), 'MMMM d, yyyy') 
    : 'Date unavailable';

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-4 text-xs mb-6">
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formattedDate}
          </time>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="relative z-10 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-8 text-center">
          {post.title}
        </h1>
        {post.author && (
          <div className="text-sm mb-12">
            <span className="text-muted-foreground">By </span>
            <span className="font-semibold text-foreground">{post.author}</span>
          </div>
        )}
      </div>

      {post.coverImage && (
        <div className="aspect-[2/1] relative mb-12 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <Markdown>{post.content || ''}</Markdown>
      </div>
    </article>
  );
}

async function BlogPost({ slug }: { slug: string }) {
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      notFound();
    }

    return <BlogPostContent post={post} />;
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