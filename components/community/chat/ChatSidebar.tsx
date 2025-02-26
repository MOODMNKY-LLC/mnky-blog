import * as React from 'react';
import { MessageSquare, Users, Bot, Sparkles, Settings, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  isCollapsed?: boolean;
}

const chatSections: SidebarSection[] = [
  {
    id: 'direct',
    name: 'Direct Messages',
    items: [
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        icon: <Bot className="h-4 w-4" />,
        badge: { type: 'live' },
      },
      {
        id: 'community-team',
        name: 'Community Team',
        icon: <Users className="h-4 w-4" />,
        badge: { type: 'new', text: 'Team' },
      },
    ],
  },
  {
    id: 'channels',
    name: 'Chat Channels',
    items: [
      {
        id: 'general',
        name: 'General Chat',
        icon: <MessageSquare className="h-4 w-4" />,
        count: 12,
      },
      {
        id: 'introductions',
        name: 'Introductions',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        id: 'help',
        name: 'Help & Support',
        icon: <MessageSquare className="h-4 w-4" />,
        badge: { type: 'updated' },
      },
      {
        id: 'feedback',
        name: 'Feedback',
        icon: <MessageSquare className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'features',
    name: 'Feature Discussions',
    items: [
      {
        id: 'ai-chat',
        name: 'AI Chat',
        icon: <Sparkles className="h-4 w-4" />,
        badge: { type: 'live', text: 'Active' },
      },
      {
        id: 'voice-chat',
        name: 'Voice Chat',
        icon: <MessageSquare className="h-4 w-4" />,
        badge: { type: 'new', text: 'Beta' },
      },
    ],
  },
];

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('general');

  // Calculate some stats for the header
  const totalChannels = chatSections.reduce((acc, section) => acc + section.items.length, 0);
  const activeChannels = chatSections.reduce((acc, section) => 
    acc + section.items.filter(item => item.badge?.type === 'live').length, 0
  );

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={chatSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Chat</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <Activity className="w-3 h-3 mr-1 text-emerald-500" />
                {activeChannels} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{totalChannels} Channels</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-md hover:bg-zinc-800/50 hover:text-amber-500"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null
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