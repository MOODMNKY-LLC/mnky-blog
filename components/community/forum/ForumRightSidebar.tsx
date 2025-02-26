import * as React from 'react';
import { MessageSquare, Star, Settings, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ForumRightSidebarProps {
  isCollapsed?: boolean;
}

interface TopicActivity {
  id: string;
  title: string;
  replies: number;
  views: number;
  lastActive: string;
}

interface TopContributor {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  posts: number;
  badge: 'gold' | 'silver' | 'bronze';
}

const activeTopics: TopicActivity[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    replies: 24,
    views: 1200,
    lastActive: '5m ago',
  },
  {
    id: '2',
    title: 'Best Practices for API Design',
    replies: 18,
    views: 850,
    lastActive: '15m ago',
  },
  {
    id: '3',
    title: 'UI/UX Design Tips',
    replies: 32,
    views: 1500,
    lastActive: '1h ago',
  },
];

const topContributors: TopContributor[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    reputation: 1250,
    posts: 85,
    badge: 'gold',
  },
  {
    id: '2',
    name: 'Mike Chen',
    reputation: 950,
    posts: 64,
    badge: 'silver',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    reputation: 720,
    posts: 45,
    badge: 'bronze',
  },
];

function TopicItem({ topic }: { topic: TopicActivity }) {
  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100 truncate">
            {topic.title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <MessageSquare className="h-3 w-3" />
          <span>{topic.replies} replies</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{topic.lastActive}</span>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {topic.views} views
      </Badge>
    </div>
  );
}

function ContributorItem({ contributor }: { contributor: TopContributor }) {
  const badgeColors = {
    gold: 'text-amber-500 bg-amber-500/10',
    silver: 'text-zinc-300 bg-zinc-300/10',
    bronze: 'text-orange-500 bg-orange-500/10',
  };

  return (
    <div className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-zinc-800/50 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={contributor.avatar} />
        <AvatarFallback>{contributor.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-100 truncate">
            {contributor.name}
          </span>
          <Badge className={cn("text-xs", badgeColors[contributor.badge])}>
            {contributor.badge}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Star className="h-3 w-3" />
          <span>{contributor.reputation} rep</span>
          <span>•</span>
          <MessageSquare className="h-3 w-3" />
          <span>{contributor.posts} posts</span>
        </div>
      </div>
    </div>
  );
}

export function ForumRightSidebar({ isCollapsed }: ForumRightSidebarProps) {
  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Forum Activity</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
            >
              <TrendingUp className="h-4 w-4" />
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
          {!isCollapsed && <span>Forum Settings</span>}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Active Topics */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-zinc-400 uppercase px-1">
            Active Topics
          </h3>
          <div className="space-y-1">
            {activeTopics.map(topic => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-zinc-400 uppercase px-1">
            Top Contributors
          </h3>
          <div className="space-y-1">
            {topContributors.map(contributor => (
              <ContributorItem key={contributor.id} contributor={contributor} />
            ))}
          </div>
        </div>
      </div>
    </BaseRightSidebar>
  );
} 