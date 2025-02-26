'use client';

import * as React from 'react';
import { Star, Calendar, Sparkles, Hash, Settings, Plus, PartyPopper, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface EventsSidebarProps {
  isCollapsed?: boolean;
}

const eventSections: SidebarSection[] = [
  {
    id: 'categories',
    name: 'Categories',
    items: [
      {
        id: 'featured',
        name: 'Featured',
        icon: <Star className="h-4 w-4" />,
      },
      {
        id: 'upcoming',
        name: 'Upcoming',
        icon: <Calendar className="h-4 w-4" />,
        count: 5,
      },
      {
        id: 'live',
        name: 'Live Now',
        icon: <Sparkles className="h-4 w-4" />,
        badge: { type: 'live', text: '2 Live' },
      },
    ],
  },
  {
    id: 'channels',
    name: 'Event Channels',
    items: [
      {
        id: 'general',
        name: 'General Events',
        icon: <Hash className="h-4 w-4" />,
      },
      {
        id: 'tech',
        name: 'Tech Meetups',
        icon: <Hash className="h-4 w-4" />,
        badge: { type: 'new' },
      },
      {
        id: 'social',
        name: 'Social Events',
        icon: <Hash className="h-4 w-4" />,
      },
      {
        id: 'workshops',
        name: 'Workshops',
        icon: <Hash className="h-4 w-4" />,
        count: 3,
      },
    ],
  },
];

export function EventsSidebar({ isCollapsed }: EventsSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('featured');

  // Calculate some stats for the header
  const upcomingEvents = eventSections
    .find(s => s.id === 'categories')
    ?.items.find(i => i.id === 'upcoming')
    ?.count || 0;
  const liveEvents = parseInt(
    eventSections
      .find(s => s.id === 'categories')
      ?.items.find(i => i.id === 'live')
      ?.badge?.text?.split(' ')[0] || '0'
  );

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={eventSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Events</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <PartyPopper className="w-3 h-3 mr-1 text-amber-500" />
                {liveEvents} Live
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{upcomingEvents} Upcoming</p>
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
                <div className="text-xs font-medium text-zinc-100">Event Settings</div>
                <div className="text-xs text-zinc-400">Manage events and RSVPs</div>
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
            {!isCollapsed && <span>Configure Events</span>}
          </Button>
        </div>
      }
    />
  );
} 