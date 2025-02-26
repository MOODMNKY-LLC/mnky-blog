'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FeatureNav } from './FeatureNav';
import { useFeatureNavigation } from '@/lib/contexts/feature-navigation';
import { EventsSidebar } from '../events/EventsSidebar';
import { ChatSidebar } from '../chat/ChatSidebar';
import { ForumSidebar } from '../forum/ForumSidebar';
import { BlogSidebar } from '../blog/BlogSidebar';
import { DiscussionsSidebar } from '../discussions/DiscussionsSidebar';
import { MembersSidebar } from '../members/MembersSidebar';
import { ChatRightSidebar } from '../chat/ChatRightSidebar';
import { BlogRightSidebar } from '../blog/BlogRightSidebar';
import { DiscussionsRightSidebar } from '../discussions/DiscussionsRightSidebar';
import { ForumRightSidebar } from '../forum/ForumRightSidebar';
import { MembersRightSidebar } from '../members/MembersRightSidebar';
import { EventsRightSidebar } from '../events/EventsRightSidebar';

interface CommunityLayoutProps {
  children: React.ReactNode;
}

export function CommunityLayout({ children }: CommunityLayoutProps) {
  const {
    currentSection,
    isLeftSidebarCollapsed,
    isRightSidebarCollapsed,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useFeatureNavigation();

  // Determine which sidebars to show based on the current section
  const showLeftSidebar = currentSection !== 'home';
  const showRightSidebar = ['chat', 'discussions', 'blog', 'forum', 'members', 'events'].includes(currentSection);

  // Get the appropriate sidebar content based on the current section
  const getLeftSidebarContent = () => {
    switch (currentSection) {
      case 'events':
        return <EventsSidebar isCollapsed={isLeftSidebarCollapsed} />;
      case 'chat':
        return <ChatSidebar isCollapsed={isLeftSidebarCollapsed} />;
      case 'forum':
        return <ForumSidebar isCollapsed={isLeftSidebarCollapsed} />;
      case 'blog':
        return <BlogSidebar isCollapsed={isLeftSidebarCollapsed} />;
      case 'discussions':
        return <DiscussionsSidebar isCollapsed={isLeftSidebarCollapsed} />;
      case 'members':
        return <MembersSidebar isCollapsed={isLeftSidebarCollapsed} />;
      default:
        return null;
    }
  };

  // Get the appropriate right sidebar content based on the current section
  const getRightSidebarContent = () => {
    switch (currentSection) {
      case 'chat':
        return <ChatRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      case 'discussions':
        return <DiscussionsRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      case 'blog':
        return <BlogRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      case 'forum':
        return <ForumRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      case 'members':
        return <MembersRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      case 'events':
        return <EventsRightSidebar isCollapsed={isRightSidebarCollapsed} />;
      default:
        return null;
    }
  };

  return (
    // Remove the top-24 positioning and make it take full viewport
    <div className="fixed inset-0 bg-zinc-950">
      <div className="relative flex h-full gap-2 p-2">
        {/* Feature Navigation Rail */}
        <div className="shrink-0">
          <div className="h-full w-[72px] rounded-lg bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md border border-zinc-800/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] overflow-hidden">
            <FeatureNav />
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-1 gap-2 min-w-0">
          {/* Left Sidebar Area */}
          <div className="relative flex h-full">
            {/* Toggle Button */}
            {showLeftSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-0 top-1/2 z-50 h-8 w-8 -translate-y-1/2 translate-x-1/2 rounded-full border border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md hover:bg-zinc-800/50 hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)] transition-all duration-300 group",
                  !showLeftSidebar && "hidden"
                )}
                onClick={toggleLeftSidebar}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Toggle Sidebar"
                    width={20}
                    height={20}
                    className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
                  />
                </div>
              </Button>
            )}

            {/* Sidebar Content */}
            {showLeftSidebar && (
              <div
                className={cn(
                  "h-full rounded-lg bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md border border-zinc-800/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] transition-[width] duration-300 overflow-hidden",
                  isLeftSidebarCollapsed ? "w-0" : "w-[280px]"
                )}
              >
                <div className="h-full w-[280px]">
                  {getLeftSidebarContent()}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="h-full rounded-lg bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md border border-zinc-800/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="min-h-[calc(100vh-6rem)] p-8 pt-32">
                  {children}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar Area */}
          <div className="relative flex h-full">
            {/* Toggle Button */}
            {showRightSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-0 top-1/2 z-50 h-8 w-8 -translate-y-1/2 -translate-x-1/2 rounded-full border border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md hover:bg-zinc-800/50 hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)] transition-all duration-300 group",
                  !showRightSidebar && "hidden"
                )}
                onClick={toggleRightSidebar}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Toggle Sidebar"
                    width={20}
                    height={20}
                    className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
                  />
                </div>
              </Button>
            )}

            {/* Sidebar Content */}
            {showRightSidebar && (
              <div
                className={cn(
                  "h-full rounded-lg bg-gradient-to-b from-zinc-900/50 via-zinc-900/25 to-zinc-900/50 backdrop-blur-md border border-zinc-800/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] transition-[width] duration-300 overflow-hidden",
                  isRightSidebarCollapsed ? "w-0" : "w-[280px]"
                )}
              >
                <div className="h-full w-[280px]">
                  {getRightSidebarContent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 