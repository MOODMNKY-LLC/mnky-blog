'use client';

import { useEffect } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    // Check if this is an image request by looking at the URL
    const isImageRequest = window.location.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    if (isImageRequest) {
      // For image requests, set status to 404
      const meta = document.createElement('meta');
      meta.httpEquiv = 'status';
      meta.content = '404';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-zinc-900 text-zinc-100">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Channel Not Found</h1>
        <p className="text-lg text-zinc-400">The channel you're looking for doesn't exist or has been deleted.</p>
        <Link href="/community/chat/general" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to General Chat</span>
        </Link>
      </div>
    </div>
  );
} 