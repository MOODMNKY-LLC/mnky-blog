import * as React from 'react';
import { MessageSquare, Users, Star, Bookmark, Settings, Flame, Hash, Plus, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DiscussionsSidebarProps {
  isCollapsed?: boolean;
}

const discussionSections: SidebarSection[] = [
  {
    id: 'discover',
    name: 'Discover',
    items: [
      {
        id: 'trending',
        name: 'Trending',
        icon: <Flame className="h-4 w-4" />,
        badge: { type: 'live', text: 'Active' },
      },
      {
        id: 'featured',
        name: 'Featured',
        icon: <Star className="h-4 w-4" />,
      },
      {
        id: 'bookmarked',
        name: 'Bookmarked',
        icon: <Bookmark className="h-4 w-4" />,
        count: 3,
      },
    ],
  },
  {
    id: 'topics',
    name: 'Topics',
    items: [
      {
        id: 'general',
        name: 'General',
        icon: <Hash className="h-4 w-4" />,
        count: 15,
      },
      {
        id: 'tech',
        name: 'Technology',
        icon: <Hash className="h-4 w-4" />,
        badge: { type: 'new' },
      },
      {
        id: 'community',
        name: 'Community',
        icon: <Hash className="h-4 w-4" />,
      },
      {
        id: 'feedback',
        name: 'Feedback',
        icon: <Hash className="h-4 w-4" />,
        badge: { type: 'updated' },
      },
    ],
  },
  {
    id: 'groups',
    name: 'Discussion Groups',
    items: [
      {
        id: 'developers',
        name: 'Developers',
        icon: <Users className="h-4 w-4" />,
        count: 32,
      },
      {
        id: 'designers',
        name: 'Designers',
        icon: <Users className="h-4 w-4" />,
        badge: { type: 'live', text: 'Meeting' },
      },
      {
        id: 'creators',
        name: 'Content Creators',
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
];

export function DiscussionsSidebar({ isCollapsed }: DiscussionsSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('trending');

  // Calculate some stats for the header
  const totalTopics = discussionSections.reduce((acc, section) => acc + section.items.length, 0);
  const activeDiscussions = discussionSections.reduce((acc, section) => 
    acc + section.items.filter(item => item.badge?.type === 'live').length, 0
  );
  const totalParticipants = discussionSections
    .find(s => s.id === 'groups')
    ?.items.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={discussionSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Discussions</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <MessagesSquare className="w-3 h-3 mr-1 text-emerald-500" />
                {activeDiscussions} Live
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{totalParticipants} Participants</p>
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
                <div className="text-xs font-medium text-zinc-100">Discussion Settings</div>
                <div className="text-xs text-zinc-400">Manage topics and notifications</div>
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
            {!isCollapsed && <span>Configure Discussions</span>}
          </Button>
        </div>
      }
    />
  );
} 