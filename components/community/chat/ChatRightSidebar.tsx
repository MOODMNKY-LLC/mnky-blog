import * as React from 'react';
import { Crown, Shield, Bot, Settings, Search, Bell, Inbox, Pin, Users, ArrowLeft, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinnedMessages } from './PinnedMessages';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type SidebarView = 'members' | 'search' | 'notifications' | 'inbox' | 'pinned';

interface ViewConfig {
  icon: LucideIcon;
  title: string;
  color: string;
}

const viewConfigs: Record<SidebarView, ViewConfig> = {
  members: {
    icon: Users,
    title: 'Members',
    color: 'text-zinc-100',
  },
  search: {
    icon: Search,
    title: 'Search Results',
    color: 'text-zinc-100',
  },
  notifications: {
    icon: Bell,
    title: 'Notifications',
    color: 'text-zinc-100',
  },
  inbox: {
    icon: Inbox,
    title: 'Direct Messages',
    color: 'text-zinc-100',
  },
  pinned: {
    icon: Pin,
    title: 'Pinned Messages',
    color: 'text-zinc-100',
  },
} as const;

interface ChatRightSidebarProps {
  isCollapsed?: boolean;
  showPinnedMessages: boolean;
  onTogglePinnedMessages: () => void;
  channelId: string;
  currentView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

interface Member {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'mod' | 'bot' | 'member';
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
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

function SidebarHeader({ 
  view, 
  onBack,
  searchQuery,
  onSearchQueryChange,
}: { 
  view: SidebarView;
  onBack: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}) {
  // Ensure view is a valid key of viewConfigs, default to 'members' if not
  const safeView = Object.keys(viewConfigs).includes(view) ? view : 'members';
  const { icon: Icon, title, color } = viewConfigs[safeView];

  return (
    <div className="px-2 py-3 border-b border-[#2b2d31]">
      <div className="flex items-center gap-2 px-2">
        {safeView !== 'members' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-zinc-800/80"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Icon className={cn("h-4 w-4", color)} />
        <span className={cn("text-sm font-semibold", color)}>{title}</span>
      </div>
      {safeView === 'search' && (
        <div className="mt-2 px-2">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            className="h-8 bg-zinc-900/50 border-zinc-800"
          />
        </div>
      )}
    </div>
  );
}

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
    <div
      className={cn(
        "w-full flex items-center gap-2 py-1 px-2 rounded hover:bg-zinc-800/50 group",
        "transition-colors duration-200",
        "text-left"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-7 w-7">
          <AvatarImage src={member.avatar} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <span className={cn(
          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full",
          "border-[0.125rem] border-[#1e1f22]",
          statusColors[member.status]
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm text-zinc-100 truncate">
            {member.name}
          </span>
          {member.role !== 'member' && (
            <span className="flex-shrink-0">
              {roleIcons[member.role]}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Settings className="h-3 w-3 text-zinc-400" />
      </Button>
    </div>
  );
}

function SearchResultItem({ message, onJumpTo }: { message: Message; onJumpTo: () => void }) {
  return (
    <button
      onClick={onJumpTo}
      className="w-full px-2 py-2 hover:bg-zinc-800/50 transition-colors group text-left"
    >
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6">
          <AvatarImage src={message.author.avatar} />
          <AvatarFallback>{message.author.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-zinc-100">{message.author.name}</span>
        <span className="text-xs text-zinc-400">{message.timestamp}</span>
      </div>
      <p className="text-sm text-zinc-300 line-clamp-2">{message.content}</p>
      <div className="mt-1 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Click to jump to message
      </div>
    </button>
  );
}

function NotificationItem() {
  // Placeholder for notification items
  return null;
}

function DirectMessageItem() {
  // Placeholder for DM items
  return null;
}

export function ChatRightSidebar({ 
  isCollapsed, 
  showPinnedMessages, 
  onTogglePinnedMessages,
  channelId,
  currentView,
  onViewChange,
  searchQuery = '',
  onSearchQueryChange,
}: ChatRightSidebarProps) {
  const handleMessageClick = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
      messageElement.classList.add('bg-muted/50');
      setTimeout(() => {
        messageElement.classList.remove('bg-muted/50');
      }, 2000);
    }
  };

  return (
    <>
      <div className={cn(
        "flex flex-col h-full bg-[#1e1f22] border-l border-[#2b2d31]",
        isCollapsed ? "w-0" : "w-[240px]"
      )}>
        <SidebarHeader 
          view={currentView}
          onBack={() => onViewChange('members')}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />
        
        <ScrollArea className="flex-1">
          {currentView === 'members' && (
            <div className="py-4">
              {['owner', 'admin', 'mod', 'bot', 'member'].map(role => {
                const roleMembers = members.filter(m => m.role === role);
                if (roleMembers.length === 0) return null;

                return (
                  <div key={role} className="mb-2">
                    <h3 className="text-xs text-zinc-500 uppercase px-2 mb-1 select-none">
                      {role === 'mod' ? 'Moderators' : role === 'bot' ? 'Bots' : `${role}s`} — {roleMembers.length}
                    </h3>
                    {roleMembers.map(member => (
                      <MemberItem key={member.id} member={member} />
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {currentView === 'search' && (
            <div className="py-2">
              {/* Placeholder for search results */}
              <SearchResultItem 
                message={{
                  id: '1',
                  content: 'This is a sample search result message that matches your query.',
                  author: {
                    name: 'John Doe',
                    avatar: undefined
                  },
                  timestamp: '2 hours ago'
                }}
                onJumpTo={() => {}}
              />
            </div>
          )}

          {currentView === 'notifications' && (
            <div className="py-2">
              {/* Placeholder for notifications */}
              <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                <Bell className="h-8 w-8 mb-2 text-zinc-500" />
                <p className="text-sm">No new notifications</p>
              </div>
            </div>
          )}

          {currentView === 'inbox' && (
            <div className="py-2">
              {/* Placeholder for direct messages */}
              <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                <Inbox className="h-8 w-8 mb-2 text-zinc-500" />
                <p className="text-sm">No direct messages</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer - can be used for status/additional actions */}
        <div className="px-2 py-2 border-t border-[#2b2d31] bg-[#1e1f22]">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-zinc-400">
              {currentView === 'members' && `${members.length} Members`}
              {currentView === 'search' && 'Search Results'}
              {currentView === 'notifications' && 'All caught up!'}
              {currentView === 'inbox' && 'Direct Messages'}
            </span>
          </div>
        </div>
      </div>

      <PinnedMessages
        channelId={channelId}
        open={showPinnedMessages}
        onOpenChange={onTogglePinnedMessages}
        onMessageClick={handleMessageClick}
      />
    </>
  );
}