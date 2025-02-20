'use client';

import { BlogPost } from '@/lib/notion/client';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus } from 'lucide-react';
import { useCallback } from 'react';

interface ActionButtonsProps {
  post: NonNullable<BlogPost>;
}

export function ActionButtons({ post }: ActionButtonsProps) {
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [post.title, post.excerpt]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <BookmarkPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
} 