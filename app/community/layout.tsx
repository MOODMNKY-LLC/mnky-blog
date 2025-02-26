'use client';

import * as React from 'react';
import { CommunityLayout } from '@/components/community/layout/CommunityLayout';
import { usePathname } from 'next/navigation';
import { useFeatureNavigation, type FeatureSection } from '@/lib/contexts/feature-navigation';

interface CommunityLayoutProps {
  children: React.ReactNode;
}

function getFeatureSection(pathname: string): FeatureSection {
  if (pathname.includes('/chat')) return 'chat';
  if (pathname.includes('/forum')) return 'forum';
  if (pathname.includes('/discussions')) return 'discussions';
  if (pathname.includes('/events')) return 'events';
  if (pathname.includes('/blog')) return 'blog';
  if (pathname.includes('/members')) return 'members';
  return 'home';
}

export default function RootLayout({ children }: CommunityLayoutProps) {
  const pathname = usePathname();
  const { setCurrentSection } = useFeatureNavigation();

  // Update current section based on pathname
  React.useEffect(() => {
    const section = getFeatureSection(pathname);
    setCurrentSection(section);
  }, [pathname, setCurrentSection]);

  return <CommunityLayout>{children}</CommunityLayout>;
} 