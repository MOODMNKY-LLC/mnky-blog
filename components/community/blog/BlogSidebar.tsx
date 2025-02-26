import * as React from 'react';
import { PenSquare, Star, Bookmark, Settings, Clock, Tags, FileText, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface BlogSidebarProps {
  isCollapsed?: boolean;
}

const blogSections: SidebarSection[] = [
  {
    id: 'content',
    name: 'Content',
    items: [
      {
        id: 'latest',
        name: 'Latest Posts',
        icon: <Clock className="h-4 w-4" />,
        badge: { type: 'new', text: '3 New' },
      },
      {
        id: 'featured',
        name: 'Featured',
        icon: <Star className="h-4 w-4" />,
      },
      {
        id: 'drafts',
        name: 'My Drafts',
        icon: <PenSquare className="h-4 w-4" />,
        count: 2,
      },
      {
        id: 'saved',
        name: 'Saved Posts',
        icon: <Bookmark className="h-4 w-4" />,
        count: 8,
      },
    ],
  },
  {
    id: 'categories',
    name: 'Categories',
    items: [
      {
        id: 'tech',
        name: 'Technology',
        icon: <FileText className="h-4 w-4" />,
        count: 12,
      },
      {
        id: 'community',
        name: 'Community',
        icon: <FileText className="h-4 w-4" />,
        badge: { type: 'updated' },
      },
      {
        id: 'tutorials',
        name: 'Tutorials',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'announcements',
        name: 'Announcements',
        icon: <FileText className="h-4 w-4" />,
        badge: { type: 'live' },
      },
    ],
  },
  {
    id: 'tags',
    name: 'Popular Tags',
    items: [
      {
        id: 'development',
        name: 'Development',
        icon: <Tags className="h-4 w-4" />,
        count: 25,
      },
      {
        id: 'design',
        name: 'Design',
        icon: <Tags className="h-4 w-4" />,
        count: 18,
      },
    ],
  },
];

export function BlogSidebar({ isCollapsed }: BlogSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('latest');

  // Calculate some stats for the header
  const totalPosts = blogSections.reduce((acc, section) => 
    acc + section.items.reduce((sum, item) => sum + (item.count || 0), 0), 0
  );
  const draftCount = blogSections
    .find(s => s.id === 'content')
    ?.items.find(i => i.id === 'drafts')
    ?.count || 0;

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={blogSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Blog</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <Edit className="w-3 h-3 mr-1 text-amber-500" />
                {draftCount} Drafts
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{totalPosts} Posts</p>
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
                <div className="text-xs font-medium text-zinc-100">Blog Settings</div>
                <div className="text-xs text-zinc-400">Manage your writing preferences</div>
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
            {!isCollapsed && <span>Configure Blog</span>}
          </Button>
        </div>
      }
    />
  );
} 