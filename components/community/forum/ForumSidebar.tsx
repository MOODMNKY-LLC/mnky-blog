import * as React from 'react';
import { Hash, Star, Bookmark, Settings, Flame, MessageSquare, Activity, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ForumSidebarProps {
  isCollapsed?: boolean;
}

const forumSections: SidebarSection[] = [
  {
    id: 'discover',
    name: 'Discover',
    items: [
      {
        id: 'trending',
        name: 'Trending',
        icon: <Flame className="h-4 w-4" />,
        badge: { type: 'live', text: 'Hot' },
      },
      {
        id: 'featured',
        name: 'Featured',
        icon: <Star className="h-4 w-4" />,
      },
      {
        id: 'saved',
        name: 'Saved',
        icon: <Bookmark className="h-4 w-4" />,
        count: 5,
      },
    ],
  },
  {
    id: 'categories',
    name: 'Categories',
    items: [
      {
        id: 'general',
        name: 'General Discussion',
        icon: <Hash className="h-4 w-4" />,
        count: 28,
      },
      {
        id: 'announcements',
        name: 'Announcements',
        icon: <Hash className="h-4 w-4" />,
        badge: { type: 'new' },
      },
      {
        id: 'feedback',
        name: 'Feedback & Ideas',
        icon: <Hash className="h-4 w-4" />,
      },
      {
        id: 'help',
        name: 'Help & Support',
        icon: <Hash className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'topics',
    name: 'Popular Topics',
    items: [
      {
        id: 'tech',
        name: 'Technology',
        icon: <MessageSquare className="h-4 w-4" />,
        count: 15,
      },
      {
        id: 'community',
        name: 'Community',
        icon: <MessageSquare className="h-4 w-4" />,
        badge: { type: 'updated' },
      },
    ],
  },
];

export function ForumSidebar({ isCollapsed }: ForumSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('trending');

  // Calculate some stats for the header
  const totalTopics = forumSections.reduce((acc, section) => acc + section.items.length, 0);
  const activeDiscussions = forumSections.reduce((acc, section) => 
    acc + section.items.reduce((sum, item) => sum + (item.count || 0), 0), 0
  );

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={forumSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Forum</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <TrendingUp className="w-3 h-3 mr-1 text-amber-500" />
                {activeDiscussions} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{totalTopics} Topics</p>
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
                <div className="text-xs font-medium text-zinc-100">Forum Settings</div>
                <div className="text-xs text-zinc-400">Manage topics and preferences</div>
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
            {!isCollapsed && <span>Configure Forum</span>}
          </Button>
        </div>
      }
    />
  );
} 