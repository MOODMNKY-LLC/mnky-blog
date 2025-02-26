'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Hash,
  ChevronDown,
  Plus,
  Volume2,
  Lock,
  Settings,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Channel {
  id: string;
  name: string;
  type: 'TEXT' | 'ANNOUNCEMENT' | 'FORUM' | 'BLOG_DISCUSSION';
  isPrivate?: boolean;
}

interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
}

interface ChannelsSidebarProps {
  categories: ChannelCategory[];
  currentChannelId?: string;
  isCollapsed?: boolean;
  onChannelSelect?: (channelId: string) => void;
}

export function ChannelsSidebar({
  categories,
  currentChannelId,
  isCollapsed = false,
  onChannelSelect,
}: ChannelsSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-zinc-800/50 px-4">
        <h2 className={cn(
          "font-semibold text-zinc-100 transition-opacity",
          isCollapsed && "opacity-0"
        )}>
          Channels
        </h2>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Channels List */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          {categories.map((category) => (
            <Collapsible key={category.id} defaultOpen>
              <div className="mb-2">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100">
                  <span className={cn(
                    "transition-opacity",
                    isCollapsed && "opacity-0"
                  )}>
                    {category.name}
                  </span>
                  {!isCollapsed && <ChevronDown className="h-3 w-3" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 space-y-[2px]">
                    {category.channels.map((channel) => (
                      <Button
                        key={channel.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-2 px-2 py-1",
                          channel.id === currentChannelId && "bg-zinc-800/50 text-zinc-100",
                          isCollapsed && "justify-center px-0"
                        )}
                        onClick={() => onChannelSelect?.(channel.id)}
                      >
                        {channel.type === 'ANNOUNCEMENT' ? (
                          <Volume2 className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <Hash className="h-4 w-4 text-zinc-400" />
                        )}
                        {!isCollapsed && (
                          <>
                            <span className="truncate">{channel.name}</span>
                            {channel.isPrivate && (
                              <Lock className="ml-auto h-3 w-3 text-zinc-400" />
                            )}
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {/* Create Channel Button */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-zinc-800/50">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-zinc-800 bg-zinc-900/50"
          >
            <Plus className="h-4 w-4" />
            Create Channel
          </Button>
        </div>
      )}
    </div>
  );
} 