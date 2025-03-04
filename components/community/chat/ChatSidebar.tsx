import * as React from 'react';
import { MessageSquare, Users, Bot, Sparkles, Settings, Activity, Plus, Home, Hash, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface ChatSidebarProps {
  isCollapsed?: boolean;
}

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Get the current slug from the URL
  const currentSlug = pathname === '/community/chat' ? 'home' : pathname.split('/').pop();

  const handleChannelSelect = (slug: string) => {
    if (slug === 'home') {
      router.push('/community/chat');
    } else {
      router.push(`/community/chat/${slug}`);
    }
  };

  const sections: SidebarSection[] = [
    {
      id: 'welcome',
      name: 'Welcome',
      items: [
        {
          id: 'home',
          name: 'Announcements',
          icon: <Home className="h-4 w-4" />,
          badge: { type: 'new', text: 'Welcome' }
        }
      ]
    },
    {
      id: 'channels',
      name: 'Channels',
      items: [
        {
          id: 'general',
          name: 'General',
          icon: <Hash className="h-4 w-4" />,
          count: 24
        },
        {
          id: 'announcements',
          name: 'Announcements',
          icon: <Megaphone className="h-4 w-4" />,
          badge: { type: 'live' }
        }
      ]
    },
    {
      id: 'direct',
      name: 'Direct Messages',
      items: [
        {
          id: 'ai-assistant',
          name: 'AI Assistant',
          icon: <Bot className="h-4 w-4" />,
          badge: { type: 'live' }
        },
        {
          id: 'community-team',
          name: 'Community Team',
          icon: <Users className="h-4 w-4" />,
          badge: { type: 'new', text: 'Team' }
        }
      ]
    },
    {
      id: 'features',
      name: 'Feature Discussions',
      items: [
        {
          id: 'ai-chat',
          name: 'AI Chat',
          icon: <Sparkles className="h-4 w-4" />,
          badge: { type: 'live', text: 'Active' }
        },
        {
          id: 'voice-chat',
          name: 'Voice Chat',
          icon: <MessageSquare className="h-4 w-4" />,
          badge: { type: 'new', text: 'Beta' }
        }
      ]
    }
  ];

  // Calculate some stats for the header
  const totalChannels = sections.reduce((acc: number, section: SidebarSection) => 
    acc + section.items.length, 0
  );
  
  const activeChannels = sections.reduce((acc: number, section: SidebarSection) => 
    acc + section.items.filter((item) => item.badge?.type === 'live').length, 0
  );

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={sections}
      selectedItemId={currentSlug}
      onItemSelect={handleChannelSelect}
      headerContent={
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          {!isCollapsed && (
            <span className="font-semibold text-zinc-100">Chat</span>
          )}
        </div>
      }
      footerContent={
        <div className="space-y-2">
          {!isCollapsed && (
            <>
              <div className="px-2">
                <div className="text-xs font-medium text-zinc-100">Chat Settings</div>
                <div className="text-xs text-zinc-400">Customize your chat experience</div>
              </div>
              <Separator className="bg-zinc-800/50" />
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full gap-2",
              "hover:bg-zinc-800/50 hover:text-amber-500",
              "border border-transparent",
              "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
              "transition-all duration-300",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Configure Chat</span>}
          </Button>
        </div>
      }
    />
  );
} 