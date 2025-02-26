'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Users,
  BookOpen,
  Hash,
  Settings,
  PenSquare,
  Bell,
  Search,
  MessagesSquare,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  name: string;
  items: NavItem[];
}

const communityNavItems: NavSection[] = [
  {
    name: 'Main',
    items: [
      {
        name: 'Chat',
        href: '/community/chat',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        name: 'Forum',
        href: '/community/forum',
        icon: <MessagesSquare className="h-4 w-4" />,
      },
      {
        name: 'Discussions',
        href: '/community/discussions',
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        name: 'Members',
        href: '/community/members',
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    name: 'Content',
    items: [
      {
        name: 'Blog Posts',
        href: '/community/blog',
        icon: <PenSquare className="h-4 w-4" />,
      },
      {
        name: 'Channels',
        href: '/community/channels',
        icon: <Hash className="h-4 w-4" />,
      },
    ],
  },
];

interface CommunityNavProps {
  isCollapsed?: boolean;
}

export function CommunityNav({ isCollapsed }: CommunityNavProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            placeholder="Search community..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 pl-8 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4">
          {communityNavItems.map((section) => (
            <div key={section.name} className="space-y-2">
              {!isCollapsed && (
                <h4 className="px-2 text-xs font-semibold text-zinc-400">
                  {section.name}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-zinc-800/50 text-zinc-100",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <Link href={item.href}>
                      {item.icon}
                      {!isCollapsed && (
                        <>
                          <span className="ml-2">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-100">Community</p>
              <p className="text-xs text-zinc-400">Settings & Notifications</p>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 border-zinc-800"
            >
              <DropdownMenuItem className="text-zinc-400 focus:text-amber-500">
                <Bell className="mr-2 h-4 w-4" />
                Notification Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-amber-500">
                <Users className="mr-2 h-4 w-4" />
                Privacy Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 