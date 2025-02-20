import { BlogPost } from '@/lib/notion/client';
import { BlogCard } from './blog-card';

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="flex flex-col space-y-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
} 