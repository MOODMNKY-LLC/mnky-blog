import * as React from 'react';
import { Users, Star, Settings, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DiscussionsRightSidebarProps {
  isCollapsed?: boolean;
}

interface Participant {
  id: string;
  name: string;
  role: 'author' | 'contributor' | 'viewer';
  avatar?: string;
  lastActive?: string;
  messageCount: number;
}

const participants: Participant[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    role: 'author',
    lastActive: 'Just now',
    messageCount: 15,
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'contributor',
    lastActive: '5m ago',
    messageCount: 8,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    role: 'contributor',
    lastActive: '15m ago',
    messageCount: 6,
  },
  {
    id: '4',
    name: 'Emma Davis',
    role: 'viewer',
    lastActive: '1h ago',
    messageCount: 2,
  },
  // Add more participants...
];

function ParticipantItem({ participant }: { participant: Participant }) {
  const roleIcons = {
    author: <Star className="h-3 w-3 text-amber-500" />,
    contributor: <MessageSquare className="h-3 w-3 text-emerald-500" />,
  };

  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={participant.avatar} />
        <AvatarFallback>{participant.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100 truncate">
            {participant.name}
          </span>
          {participant.role !== 'viewer' && (
            <span className="flex-shrink-0">
              {roleIcons[participant.role]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="h-3 w-3" />
          <span>{participant.lastActive}</span>
          <span>•</span>
          <span>{participant.messageCount} messages</span>
        </div>
      </div>
    </div>
  );
}

export function DiscussionsRightSidebar({ isCollapsed }: DiscussionsRightSidebarProps) {
  const activeCount = participants.filter(p => p.lastActive?.includes('ago')).length;

  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Participants</h2>
            <Badge variant="secondary" className="text-xs">
              {activeCount} Active
            </Badge>
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
          {!isCollapsed && <span>Discussion Settings</span>}
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Group by role */}
        {['author', 'contributor', 'viewer'].map(role => {
          const roleParticipants = participants.filter(p => p.role === role);
          if (roleParticipants.length === 0) return null;

          return (
            <div key={role} className="space-y-1">
              <h3 className="text-xs font-medium text-zinc-400 uppercase px-1">
                {role === 'author' ? 'Author' : `${role}s`}
                {' '}— {roleParticipants.length}
              </h3>
              {roleParticipants.map(participant => (
                <ParticipantItem key={participant.id} participant={participant} />
              ))}
            </div>
          );
        })}
      </div>
    </BaseRightSidebar>
  );
} 