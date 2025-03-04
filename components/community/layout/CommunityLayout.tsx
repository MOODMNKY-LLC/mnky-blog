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
import { ChatInput } from '../chat/ChatInput';
import { ChatHeader } from '../chat/ChatHeader';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/use-user';

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
  const pathname = usePathname();
  const supabase = createClient();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [channelId, setChannelId] = React.useState<string | null>(null);
  const [channel, setChannel] = React.useState<any>(null);
  const [showPinnedMessages, setShowPinnedMessages] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Get the current channel ID and info from the URL if we're in a chat channel
  React.useEffect(() => {
    async function getChannelInfo() {
      if (currentSection === 'chat' && pathname.startsWith('/community/chat/')) {
        // First get the slug from the URL
        const slug = pathname.split('/').pop();
        if (!slug) return;
        
        // Then get the channel info from the slug
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          console.error('Error getting channel info:', error);
          return;
        }
        
        setChannelId(data?.id || null);
        setChannel(data);
      } else {
        setChannelId(null);
        setChannel(null);
      }
    }

    getChannelInfo();
  }, [pathname, currentSection, supabase]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    if (!channelId || !user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.from('messages').insert({
        channel_id: channelId,
        user_id: user.id,
        content,
        metadata: {}, // Add empty metadata object for new messages
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        return (
          <ChatRightSidebar 
            isCollapsed={isRightSidebarCollapsed}
            showPinnedMessages={showPinnedMessages}
            onTogglePinnedMessages={() => setShowPinnedMessages(!showPinnedMessages)}
            channelId={channelId || ''}
            currentView="members"
            onViewChange={() => {}}
          />
        );
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
              <div className="flex flex-col h-full">
                {/* Chat Header - Only show for chat section */}
                {currentSection === 'chat' && channelId && channel && (
                  <div className="sticky top-0 z-50 bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50">
                    <ChatHeader 
                      channelName={channel.name}
                      channelDescription={channel.description}
                      isPinned={showPinnedMessages}
                      onPinnedClick={() => setShowPinnedMessages(!showPinnedMessages)}
                      onSearch={setSearchQuery}
                    />
                  </div>
                )}
                <div className="flex-1 overflow-y-auto">
                  <div className={cn(
                    "min-h-[calc(100vh-6rem)]",
                    currentSection === 'chat' ? "pb-36" : "p-8 pt-32"
                  )}>
                    {children}
                  </div>
                </div>
                {/* Floating Chat Input */}
                {currentSection === 'chat' && channelId && (
                  <div className="absolute bottom-0 left-0 right-0 z-10">
                    <div className="px-4 pb-4 pt-8 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
                      <div className="max-w-3xl mx-auto">
                        <ChatInput channelId={channelId} />
                      </div>
                    </div>
                  </div>
                )}
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