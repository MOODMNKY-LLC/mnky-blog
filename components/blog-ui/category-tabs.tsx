'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: string[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8" aria-label="Blog categories">
        <Link
          href="/"
          className={cn(
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
            !currentCategory
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
          )}
        >
          All Posts
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/?category=${category.toLowerCase()}`}
            className={cn(
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
              currentCategory === category.toLowerCase()
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
            )}
          >
            {category}
          </Link>
        ))}
      </nav>
    </div>
  );
} 