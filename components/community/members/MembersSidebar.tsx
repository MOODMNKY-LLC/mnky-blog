import * as React from 'react';
import { Users, Star, Settings, Shield, Crown, Bot, UserPlus, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseSidebar, type SidebarSection } from '../shared/BaseSidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MembersSidebarProps {
  isCollapsed?: boolean;
}

const memberSections: SidebarSection[] = [
  {
    id: 'overview',
    name: 'Overview',
    items: [
      {
        id: 'all',
        name: 'All Members',
        icon: <Users className="h-4 w-4" />,
        count: 256,
      },
      {
        id: 'online',
        name: 'Online Now',
        icon: <Users className="h-4 w-4" />,
        badge: { type: 'live', text: '24' },
      },
      {
        id: 'new',
        name: 'New Members',
        icon: <UserPlus className="h-4 w-4" />,
        badge: { type: 'new', text: '+5' },
      },
    ],
  },
  {
    id: 'roles',
    name: 'Member Roles',
    items: [
      {
        id: 'admins',
        name: 'Administrators',
        icon: <Crown className="h-4 w-4" />,
        count: 3,
      },
      {
        id: 'moderators',
        name: 'Moderators',
        icon: <Shield className="h-4 w-4" />,
        count: 8,
      },
      {
        id: 'contributors',
        name: 'Contributors',
        icon: <Star className="h-4 w-4" />,
        count: 42,
      },
    ],
  },
  {
    id: 'special',
    name: 'Special Members',
    items: [
      {
        id: 'bots',
        name: 'Bot Accounts',
        icon: <Bot className="h-4 w-4" />,
        count: 2,
      },
      {
        id: 'verified',
        name: 'Verified Members',
        icon: <Shield className="h-4 w-4" />,
        badge: { type: 'updated' },
      },
    ],
  },
];

export function MembersSidebar({ isCollapsed }: MembersSidebarProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>('all');

  // Calculate some stats for the header
  const totalMembers = memberSections
    .find(s => s.id === 'overview')
    ?.items.find(i => i.id === 'all')
    ?.count || 0;
  const onlineMembers = parseInt(
    memberSections
      .find(s => s.id === 'overview')
      ?.items.find(i => i.id === 'online')
      ?.badge?.text || '0'
  );

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      sections={memberSections}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      headerContent={
        !isCollapsed ? (
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Members</h2>
              <Badge variant="outline" className="text-[10px] h-5 border-zinc-800 bg-zinc-900/50 text-zinc-400">
                <Activity className="w-3 h-3 mr-1 text-emerald-500" />
                {onlineMembers} Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{totalMembers} Total Members</p>
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
                <div className="text-xs font-medium text-zinc-100">Member Settings</div>
                <div className="text-xs text-zinc-400">Manage roles and permissions</div>
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
            {!isCollapsed && <span>Configure Members</span>}
          </Button>
        </div>
      }
    />
  );
} 