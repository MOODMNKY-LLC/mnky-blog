import * as React from 'react';
import { Users, Activity, Settings, Clock, Star, MessageSquare, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MembersRightSidebarProps {
  isCollapsed?: boolean;
}

interface MemberStats {
  totalMembers: number;
  onlineNow: number;
  newToday: number;
  activeToday: number;
}

interface RecentActivity {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  action: 'joined' | 'posted' | 'liked' | 'replied';
  target: string;
  timestamp: string;
}

const stats: MemberStats = {
  totalMembers: 1250,
  onlineNow: 42,
  newToday: 8,
  activeToday: 156,
};

const recentActivity: RecentActivity[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Emma Davis',
    action: 'joined',
    target: 'the community',
    timestamp: 'Just now',
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'John Smith',
    action: 'posted',
    target: 'Getting Started Guide',
    timestamp: '5m ago',
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Lisa Wong',
    action: 'liked',
    target: 'Community Guidelines',
    timestamp: '15m ago',
  },
  {
    id: '4',
    memberId: '4',
    memberName: 'Tom Wilson',
    action: 'replied',
    target: 'Welcome Thread',
    timestamp: '1h ago',
  },
];

function StatItem({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-zinc-800/30">
      <Icon className="h-4 w-4 text-zinc-400" />
      <div className="flex-1">
        <div className="text-sm font-medium text-zinc-100">{value}</div>
        <div className="text-xs text-zinc-400">{label}</div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const actionIcons = {
    joined: Users,
    posted: MessageSquare,
    liked: Heart,
    replied: MessageSquare,
  };

  const ActionIcon = actionIcons[activity.action];

  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.memberAvatar} />
        <AvatarFallback>{activity.memberName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100">
            {activity.memberName}
          </span>
          <ActionIcon className="h-3 w-3 text-zinc-400" />
          <span className="text-sm text-zinc-400 truncate">
            {activity.target}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="h-3 w-3" />
          <span>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function MembersRightSidebar({ isCollapsed }: MembersRightSidebarProps) {
  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Member Stats</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        )
      }
      footerContent={
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Member Settings</span>}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatItem label="Total Members" value={stats.totalMembers} icon={Users} />
          <StatItem label="Online Now" value={stats.onlineNow} icon={Activity} />
          <StatItem label="New Today" value={stats.newToday} icon={Star} />
          <StatItem label="Active Today" value={stats.activeToday} icon={MessageSquare} />
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-zinc-400 uppercase px-1">
            Recent Activity
          </h3>
          <div className="space-y-1">
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </BaseRightSidebar>
  );
} 