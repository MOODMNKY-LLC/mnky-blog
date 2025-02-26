'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  MessagesSquare,
  PenSquare,
  BookOpen,
  Calendar,
  Users,
  PartyPopper,
  Check,
  User,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFeatureNavigation, type FeatureSection } from '@/lib/contexts/feature-navigation';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileSheet } from '@/components/profile/profile-sheet';
import { type User as AuthUser } from '@supabase/supabase-js';
import { AvatarCircles } from '@/components/avatar-circles';

interface FeatureItem {
  id: FeatureSection;
  name: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
  badge?: {
    count?: number;
    type?: 'new' | 'live' | 'upcoming';
  };
}

const features: FeatureItem[] = [
  {
    id: 'chat',
    name: 'Chat',
    href: '/community/chat',
    icon: <MessageSquare className="h-5 w-5" />,
    badge: { type: 'live' }
  },
  {
    id: 'forum',
    name: 'Forum',
    href: '/community/forum',
    icon: <MessagesSquare className="h-5 w-5" />,
    badge: { count: 3 }
  },
  {
    id: 'blog',
    name: 'Blog',
    href: '/community/blog',
    icon: <PenSquare className="h-5 w-5" />,
  },
  {
    id: 'discussions',
    name: 'Discussions',
    href: '/community/discussions',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'events',
    name: 'Events',
    href: '/community/events',
    icon: <Calendar className="h-5 w-5" />,
    badge: { type: 'upcoming' }
  },
  {
    id: 'members',
    name: 'Members',
    href: '/community/members',
    icon: <Users className="h-5 w-5" />,
  }
];

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  email: string;
  bio: string | null;
  role: 'user' | 'moderator' | 'admin' | 'author' | 'editor';
  availability_status: 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE' | 'INVISIBLE' | null;
  preferences: Record<string, unknown>;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

function UserAvatar() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const supabase = createClient();

  const availabilityStatuses = [
    { value: 'ONLINE', label: 'Online', icon: <div className="h-2 w-2 rounded-full bg-emerald-500" /> },
    { value: 'AWAY', label: 'Away', icon: <div className="h-2 w-2 rounded-full bg-amber-500" /> },
    { value: 'DND', label: 'Do Not Disturb', icon: <div className="h-2 w-2 rounded-full bg-red-500" /> },
    { value: 'INVISIBLE', label: 'Invisible', icon: <div className="h-2 w-2 rounded-full bg-zinc-500" /> },
  ];

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function updateAvailabilityStatus(status: Profile['availability_status']) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ availability_status: status })
        .eq('id', user?.id);

      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, availability_status: status } : null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  React.useEffect(() => {
    getProfile();
  }, []);

  React.useEffect(() => {
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

    if (profile?.avatar_url) downloadImage(profile.avatar_url);
  }, [profile?.avatar_url, supabase]);

  const statusStyles = {
    ONLINE: {
      ring: 'border-emerald-500/50',
      glow: 'hover:shadow-[0_0_12px_0_rgba(16,185,129,0.5)]',
      dot: 'bg-emerald-500'
    },
    AWAY: {
      ring: 'border-amber-500/50',
      glow: 'hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]',
      dot: 'bg-amber-500'
    },
    DND: {
      ring: 'border-red-500/50',
      glow: 'hover:shadow-[0_0_12px_0_rgba(239,68,68,0.5)]',
      dot: 'bg-red-500'
    },
    OFFLINE: {
      ring: 'border-zinc-800/50',
      glow: 'hover:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]',
      dot: 'bg-zinc-500'
    },
    INVISIBLE: {
      ring: 'border-zinc-800/50',
      glow: 'hover:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]',
      dot: 'bg-zinc-500'
    }
  };

  const currentStatus = profile?.availability_status || 'OFFLINE';
  const currentStyle = statusStyles[currentStatus];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative w-14 h-14 rounded-full",
              "bg-transparent",
              "p-0",
              "hover:bg-transparent",
              "transition-all duration-300 ease-in-out",
              "group"
            )}
          >
            <div className="relative">
              {avatarUrl ? (
                <Avatar className={cn(
                  "h-14 w-14 border-2",
                  currentStyle.ring,
                  currentStyle.glow,
                  "transition-all duration-300 ease-in-out"
                )}>
                  <AvatarImage src={avatarUrl} alt={profile?.full_name || 'Avatar'} />
                  <AvatarFallback className="bg-zinc-900/50 text-amber-500">
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className={cn(
                  "h-14 w-14 border-2",
                  currentStyle.ring,
                  currentStyle.glow,
                  "transition-all duration-300 ease-in-out"
                )}>
                  <AvatarFallback className="bg-zinc-900/50 text-amber-500">
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-zinc-900",
                currentStyle.dot
              )} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-900/90 border-zinc-800/50 backdrop-blur-sm">
          <DropdownMenuGroup>
            {availabilityStatuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => updateAvailabilityStatus(status.value as Profile['availability_status'])}
                className="flex items-center gap-2 cursor-pointer"
              >
                {status.icon}
                <span>{status.label}</span>
                {profile?.availability_status === status.value && (
                  <Check className="h-4 w-4 ml-auto text-emerald-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <ProfileSheet user={user}>
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
            </ProfileSheet>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FeatureNav() {
  const { currentSection, setCurrentSection } = useFeatureNavigation();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col items-center">
        {/* Home button */}
        <div className="py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/community">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative w-14 h-14 rounded-full",
                    "bg-zinc-900/50 dark:bg-zinc-900/50",
                    "backdrop-blur-sm",
                    "border border-zinc-800/50",
                    "hover:bg-zinc-800/50",
                    "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
                    "transition-all duration-300 ease-in-out",
                    "group",
                    currentSection === 'home' && "bg-zinc-800/50 border-amber-500/50 shadow-[0_0_12px_0_rgba(245,158,11,0.5)]"
                  )}
                  onClick={() => setCurrentSection('home')}
                >
                  <div className={cn(
                    "text-zinc-400 group-hover:text-amber-500 transition-colors",
                    currentSection === 'home' && "text-amber-500"
                  )}>
                    <Home className="h-5 w-5" />
                  </div>
                  <span className="sr-only">Home</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              sideOffset={8}
              className="bg-zinc-900/90 border-zinc-800/50 backdrop-blur-sm px-3 py-2"
            >
              <span className="text-sm font-medium text-zinc-100">Community Home</span>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Separator */}
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent mb-4" />

        {/* Feature buttons */}
        <div className="flex flex-col items-center gap-4 py-4">
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              feature={feature}
              isActive={currentSection === feature.id}
              onClick={() => setCurrentSection(feature.id)}
            />
          ))}
        </div>

        {/* Bottom section with user avatar */}
        <div className="mt-auto pb-4">
          <UserAvatar />
        </div>
      </div>
    </TooltipProvider>
  );
}

interface FeatureButtonProps {
  feature: FeatureItem;
  isActive: boolean;
  onClick: () => void;
}

function FeatureButton({ feature, isActive, onClick }: FeatureButtonProps) {
  const badgeColors = {
    new: 'bg-amber-500/20 text-amber-500',
    live: 'bg-emerald-500/20 text-emerald-500',
    upcoming: 'bg-blue-500/20 text-blue-500'
  };

  const getBadgeText = (badge: FeatureItem['badge']) => {
    if (!badge) return null;
    if (badge.count) return badge.count;
    switch (badge.type) {
      case 'live': return 'LIVE';
      case 'new': return 'NEW';
      case 'upcoming': return 'SOON';
      default: return null;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={feature.href}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative w-14 h-14 rounded-full",
              "bg-zinc-900/50 dark:bg-zinc-900/50",
              "backdrop-blur-sm",
              "border border-zinc-800/50",
              "hover:bg-zinc-800/50",
              "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
              "transition-all duration-300 ease-in-out",
              "group",
              isActive && "bg-zinc-800/50 border-amber-500/50 shadow-[0_0_12px_0_rgba(245,158,11,0.5)]"
            )}
            onClick={onClick}
          >
            <div className={cn(
              "text-zinc-400 group-hover:text-amber-500 transition-colors",
              isActive && "text-amber-500"
            )}>
              <div className="h-5 w-5 flex items-center justify-center">
                {feature.icon}
              </div>
            </div>

            {/* Hidden label for accessibility */}
            <span className="sr-only">{feature.name}</span>
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        sideOffset={8}
        className="bg-zinc-900/90 border-zinc-800/50 backdrop-blur-sm px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-100">
            {feature.name}
          </span>
          {feature.badge && (
            <span className={cn(
              "min-w-[18px] h-[18px] px-1.5",
              "text-[10px] font-medium rounded-full",
              "flex items-center justify-center",
              feature.badge.type ? badgeColors[feature.badge.type] : "bg-amber-500/20 text-amber-500"
            )}>
              {getBadgeText(feature.badge)}
            </span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
} 