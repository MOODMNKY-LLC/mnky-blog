import * as React from 'react';
import { Users, Crown, Shield, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChatRightSidebarProps {
  isCollapsed?: boolean;
}

interface Member {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'mod' | 'bot' | 'member';
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar?: string;
}

const members: Member[] = [
  {
    id: '1',
    name: 'MNKY Bot',
    role: 'bot',
    status: 'online',
    avatar: '/logo.png',
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'owner',
    status: 'online',
  },
  {
    id: '3',
    name: 'Jane Smith',
    role: 'admin',
    status: 'idle',
  },
  {
    id: '4',
    name: 'Bob Johnson',
    role: 'mod',
    status: 'dnd',
  },
  // Add more members...
];

function MemberItem({ member }: { member: Member }) {
  const roleIcons = {
    owner: <Crown className="h-3 w-3 text-amber-500" />,
    admin: <Crown className="h-3 w-3 text-purple-500" />,
    mod: <Shield className="h-3 w-3 text-blue-500" />,
    bot: <Bot className="h-3 w-3 text-emerald-500" />,
  };

  const statusColors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-zinc-500',
  };

  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <span className={cn(
          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900",
          statusColors[member.status]
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100 truncate">
            {member.name}
          </span>
          {member.role !== 'member' && (
            <span className="flex-shrink-0">
              {roleIcons[member.role]}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 capitalize">{member.status}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ChatRightSidebar({ isCollapsed }: ChatRightSidebarProps) {
  const onlineCount = members.filter(m => m.status === 'online').length;

  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Members</h2>
            <Badge variant="secondary" className="text-xs">
              {onlineCount} Online
            </Badge>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* Roles */}
        {['owner', 'admin', 'mod', 'bot', 'member'].map(role => {
          const roleMembers = members.filter(m => m.role === role);
          if (roleMembers.length === 0) return null;

          return (
            <div key={role} className="space-y-1">
              <h3 className="text-xs font-medium text-zinc-400 uppercase px-1">
                {role === 'mod' ? 'Moderators' : role === 'bot' ? 'Bots' : `${role}s`}
                {' '}— {roleMembers.length}
              </h3>
              {roleMembers.map(member => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          );
        })}
      </div>
    </BaseRightSidebar>
  );
} 