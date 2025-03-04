import * as React from 'react';
import { MessageSquare, Users, Bot, Sparkles, Settings, Activity, Plus, Home, Hash, Megaphone, Inbox, Bell, MessageCircle, ThumbsUp, GitBranch, Rocket, Music, Palette, Brain, Heart, Lightbulb } from 'lucide-react';
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
  
  // Get the current section and channel from the URL
  const pathParts = pathname.split('/').filter(Boolean);
  const currentSection = pathParts[1] || 'chat';
  const currentChannel = pathParts[2] || 'home';

  const handleChannelSelect = (section: string, channel: string) => {
    if (channel === 'home') {
      router.push(`/community/${section}`);
    } else {
      router.push(`/community/${section}/${channel}`);
    }
  };

  const sections: SidebarSection[] = [
    {
      id: 'welcome',
      name: 'Welcome',
      items: [
        {
          id: 'home',
          name: 'Community Updates',
          icon: <Home className="h-4 w-4" />,
          badge: { type: 'new', text: 'Welcome' }
        }
      ]
    },
    {
      id: 'spaces',
      name: 'Community Spaces',
      items: [
        {
          id: 'general',
          name: 'General Discussion',
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
      id: 'inbox',
      name: 'Your Activity',
      items: [
        {
          id: 'messages',
          name: 'Direct Messages',
          icon: <Inbox className="h-4 w-4" />,
          badge: { type: 'new', text: '3' }
        },
        {
          id: 'notifications',
          name: 'Notifications',
          icon: <Bell className="h-4 w-4" />,
          badge: { type: 'live', text: '5' }
        },
        {
          id: 'reactions',
          name: 'Post Reactions',
          icon: <Heart className="h-4 w-4" />,
          count: 8
        },
        {
          id: 'replies',
          name: 'Post Replies',
          icon: <MessageCircle className="h-4 w-4" />,
          count: 12
        }
      ]
    },
    {
      id: 'features',
      name: 'Explore & Learn',
      items: [
        {
          id: 'upcoming',
          name: 'New Features',
          icon: <Lightbulb className="h-4 w-4" />,
          badge: { type: 'new', text: '2' }
        },
        {
          id: 'roadmap',
          name: 'Product Updates',
          icon: <GitBranch className="h-4 w-4" />,
          badge: { type: 'updated' }
        },
        {
          id: 'ai-features',
          name: 'AI Assistant',
          icon: <Brain className="h-4 w-4" />,
          badge: { type: 'live', text: 'Active' }
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
      selectedItemId={currentChannel}
      onItemSelect={(channel) => handleChannelSelect(currentSection, channel)}
      headerContent={
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          {!isCollapsed && (
            <span className="font-semibold text-zinc-100">Community Chat</span>
          )}
        </div>
      }
      footerContent={
        <div className="space-y-2">
          {!isCollapsed && (
            <>
              <div className="px-2">
                <div className="text-xs font-medium text-zinc-100">Chat Preferences</div>
                <div className="text-xs text-zinc-400">Customize your experience</div>
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
            {!isCollapsed && <span>Chat Settings</span>}
          </Button>
        </div>
      }
    />
  );
} 