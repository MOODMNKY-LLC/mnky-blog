'use client';

import * as React from 'react';
import { Crown, Shield, Bot, Settings, Search, Bell, Inbox, Pin, Users, ArrowLeft, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinnedMessages } from './PinnedMessages';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { AvatarCircles } from "@/components/avatar-circles";

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

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'mod' | 'bot' | 'member';
  last_seen: string | null;
  availability_status: 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE' | 'INVISIBLE' | null;
}

interface Member extends Profile {
  status: 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE' | 'INVISIBLE';
  custom_status?: string;
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

interface PresenceState {
  presence_ref: string;
  user_id?: string;
  status?: Member['status'];
  timestamp?: string;
  custom_status?: string;
}

function useMemberProfiles() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Initial fetch of all profiles and their presence
    async function fetchProfiles() {
      try {
        const [profilesResponse, presenceResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .order('display_name'),
          supabase
            .from('user_presence')
            .select('*')
        ]);

        if (profilesResponse.error) throw profilesResponse.error;
        if (presenceResponse.error) throw presenceResponse.error;

        const profiles = profilesResponse.data || [];
        const presence = presenceResponse.data || [];

        // Merge profiles with presence data
        const initialMembers = profiles.map((profile: Profile) => {
          const userPresence = presence.find(p => p.user_id === profile.id);
          return {
            ...profile,
            // Use availability_status from profile, fallback to presence status, then OFFLINE
            status: (profile.availability_status || userPresence?.status?.toUpperCase() || 'OFFLINE') as Member['status'],
            last_seen: userPresence?.last_seen || null,
            custom_status: userPresence?.custom_status
          };
        });

        setMembers(initialMembers);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    }

    // Subscribe to presence changes
    const presenceChannel = supabase.channel('online-users');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        
        setMembers(currentMembers => 
          currentMembers.map(member => {
            const presenceArray = presenceState[member.id] as PresenceState[] | undefined;
            // If no presence data or empty array, maintain the current availability_status
            if (!presenceArray?.length) return member;

            // Get the latest presence data
            const presence = presenceArray[0];
            return {
              ...member,
              status: member.availability_status || (presence.status?.toUpperCase() || 'ONLINE') as Member['status'],
              last_seen: presence.timestamp || new Date().toISOString(),
              custom_status: presence.custom_status
            };
          })
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const presence: PresenceState = {
              presence_ref: crypto.randomUUID(),
              user_id: user.id,
              status: 'ONLINE',
              timestamp: new Date().toISOString()
            };
            await presenceChannel.track(presence);
          }
        }
      });

    // Subscribe to profile changes
    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          setMembers(currentMembers => {
            const updatedProfile = payload.new as Profile;
            return currentMembers.map(member => 
              member.id === updatedProfile.id 
                ? { 
                    ...member, 
                    ...updatedProfile,
                    // Ensure we update the status when availability_status changes
                    status: updatedProfile.availability_status || member.status
                  }
                : member
            );
          });
        }
      )
      .subscribe();

    // Initial fetch
    fetchProfiles();

    // Set up window focus/blur listeners for auto-status
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        presenceChannel.track({
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          status: 'ONLINE',
          timestamp: new Date().toISOString()
        });
      } else {
        presenceChannel.track({
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          status: 'AWAY',
          timestamp: new Date().toISOString()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup subscriptions and listeners
    return () => {
      presenceChannel.unsubscribe();
      profileSubscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { members, loading };
}

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
  const safeView = Object.keys(viewConfigs).includes(view) ? view : 'members';
  const { icon: Icon, title, color } = viewConfigs[safeView];

  return (
    <div className="sticky top-0 z-10 px-2 py-3 border-b border-zinc-800/50 bg-zinc-900/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-2">
        {safeView !== 'members' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-zinc-800/80 hover:text-amber-500 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Icon className={cn("h-4 w-4 text-amber-500")} />
        <span className="text-sm font-semibold text-zinc-100 truncate">{title}</span>
      </div>
      {safeView === 'search' && (
        <div className="mt-2 px-2">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            className="h-8 bg-zinc-800/50 border-zinc-700/50 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all w-full"
          />
        </div>
      )}
    </div>
  );
}

function MemberItem({ member }: { member: Member }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Error downloading avatar:', error);
      }
    }

    if (member.avatar_url) downloadImage(member.avatar_url);
  }, [member.avatar_url, supabase]);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 group">
      <div className="relative">
        <AvatarCircles
          avatars={[{
            imageUrl: avatarUrl || '/default-avatar.png',
            profileUrl: `/community/members/${member.id}`,
            availability: member.status.toLowerCase() as 'online' | 'away' | 'dnd' | 'offline' | 'invisible'
          }]}
          size={32}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-100 truncate">
          {member.display_name || 'Unknown User'}
        </p>
        {member.custom_status && (
          <p className="text-xs text-zinc-400 truncate">
            {member.custom_status}
          </p>
        )}
      </div>
    </div>
  );
}

function MemberSection({ title, members, count }: { title: string; members: Member[]; count?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {title} {count !== undefined && `(${count})`}
        </h3>
      </div>
      <div className="space-y-1">
        {members.map((member) => (
          <MemberItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function SearchResultItem({ message, onJumpTo }: { message: Message; onJumpTo: () => void }) {
  return (
    <button
      onClick={onJumpTo}
      className={cn(
        "w-full px-2 py-2 rounded-lg",
        "hover:bg-zinc-800/50 transition-all",
        "group text-left",
        "border border-transparent",
        "hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)]"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6 border border-zinc-800/50">
          <AvatarImage src={message.author.avatar} />
          <AvatarFallback className="bg-zinc-800/50 text-amber-500">{message.author.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-zinc-100 group-hover:text-amber-500 transition-colors">{message.author.name}</span>
        <span className="text-xs text-zinc-400">{message.timestamp}</span>
      </div>
      <p className="text-sm text-zinc-300 line-clamp-2 group-hover:text-zinc-100 transition-colors">{message.content}</p>
      <div className="mt-1 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:text-amber-500 transition-all">
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
  const { members, loading } = useMemberProfiles();

  // Filter and sort members by status and role
  const onlineMembers = members.filter(m => 
    m.role !== 'bot' && 
    ['ONLINE', 'AWAY', 'DND'].includes(m.status)
  ).sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));

  const bots = members.filter(m => 
    m.role === 'bot'
  ).sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));

  const offlineMembers = members.filter(m => 
    m.role !== 'bot' && 
    ['OFFLINE', 'INVISIBLE'].includes(m.status)
  ).sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));

  const handleMessageClick = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
      messageElement.classList.add('bg-amber-500/10');
      setTimeout(() => {
        messageElement.classList.remove('bg-amber-500/10');
      }, 2000);
    }
  };

  return (
    <>
      <div className={cn(
        "flex flex-col h-full",
        "border-l border-zinc-800/20 bg-zinc-900/60 backdrop-blur-xl",
        "shadow-[0_0_20px_0_rgba(0,0,0,0.1)]",
        isCollapsed ? "w-0" : "w-[240px]",
        "overflow-hidden"
      )}>
        <div className="border-b border-zinc-800/20 px-4 py-3 bg-gradient-to-b from-zinc-900/30 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-zinc-100">Members</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          {currentView === 'members' ? (
            loading ? (
              <div className="space-y-2 py-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-2 py-1.5 px-2">
                      <div className="h-7 w-7 rounded-full bg-zinc-800/50" />
                      <div className="flex-1 h-4 bg-zinc-800/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4">
                {/* Online Members Section */}
                <div>
                  {onlineMembers.length > 0 ? (
                    <MemberSection 
                      title="Online" 
                      members={onlineMembers}
                      count={onlineMembers.length} 
                    />
                  ) : (
                    <div className="px-2">
                      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Online (0)
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 italic">No members online</p>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="my-6 px-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />
                </div>
                
                {/* Bots Section */}
                <div>
                  {bots.length > 0 ? (
                    <MemberSection 
                      title="Bots" 
                      members={bots}
                      count={bots.length} 
                    />
                  ) : (
                    <div className="px-2">
                      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Bots (0)
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 italic">No bots available</p>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="my-6 px-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />
                </div>
                
                {/* Offline Members Section */}
                <div>
                  {offlineMembers.length > 0 ? (
                    <MemberSection 
                      title="Offline" 
                      members={offlineMembers}
                      count={offlineMembers.length} 
                    />
                  ) : (
                    <div className="px-2">
                      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Offline (0)
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 italic">No offline members</p>
                    </div>
                  )}
                </div>

                {members.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full space-y-2 text-zinc-400 mt-8">
                    <Users className="h-8 w-8" />
                    <p className="text-sm">No members found</p>
                  </div>
                )}
              </div>
            )
          ) : currentView === 'search' ? (
            <div className="py-4 space-y-2">
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
          ) : currentView === 'notifications' ? (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-amber-500/50" />
                </div>
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-zinc-500 text-center">When you receive notifications, they'll appear here</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-amber-500/50" />
                </div>
                <p className="text-sm font-medium">No direct messages</p>
                <p className="text-xs text-zinc-500 text-center">When you receive messages, they'll appear here</p>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-zinc-800/20 p-4 bg-gradient-to-t from-zinc-900/30 to-transparent">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <div className="font-medium text-zinc-100">{members.length} Members</div>
              <div className="text-zinc-400">{onlineMembers.length} online</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-zinc-800/50 hover:text-amber-500 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Button>
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