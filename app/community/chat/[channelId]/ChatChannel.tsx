'use client';

import * as React from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ChatMessages } from '@/components/community/chat/ChatMessages';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/use-user';
import { Hash, Volume2, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatHeader } from '@/components/community/chat/ChatHeader';
import { PinnedMessages } from '@/components/community/chat/PinnedMessages';

type SidebarView = 'members' | 'search' | 'notifications' | 'inbox' | 'pinned';

interface Channel {
  id: string;
  name: string;
  slug: string;
  type: 'TEXT' | 'ANNOUNCEMENT' | 'BLOG_DISCUSSION' | 'FORUM_THREAD' | 'EVENT_CHAT' | 'DIRECT_MESSAGE';
  description?: string;
  is_private: boolean;
  is_direct: boolean;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at?: string;
  member_count: number;
}

interface ChatChannelProps {
  channel: Channel;
}

export function ChatChannel({ channel }: ChatChannelProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSendMessage = async (content: string, type: string = 'TEXT') => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('messages').insert({
        channel_id: channel.id,
        user_id: user.id,
        content,
        type,
        metadata: {}, // Add empty metadata object for new messages
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the appropriate icon for the channel type
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return <Volume2 className="h-5 w-5" />;
      case 'BLOG_DISCUSSION':
      case 'FORUM_THREAD':
        return <Hash className="h-5 w-5" />;
      case 'EVENT_CHAT':
      case 'DIRECT_MESSAGE':
        return <Users className="h-5 w-5" />;
      default:
        return <Hash className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages Content */}
        <div className="flex-1 min-h-0">
          <ChatMessages 
            channelId={channel.id} 
            currentUser={user}
            showPinnedMessages={showPinnedMessages}
            onTogglePinnedMessages={() => setShowPinnedMessages(!showPinnedMessages)}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* PinnedMessages Dialog */}
      <PinnedMessages
        channelId={channel.id}
        open={showPinnedMessages}
        onOpenChange={setShowPinnedMessages}
        onMessageClick={(messageId) => {
          const messageElement = document.getElementById(`message-${messageId}`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth' });
            messageElement.classList.add('bg-muted/50');
            setTimeout(() => {
              messageElement.classList.remove('bg-muted/50');
            }, 2000);
          }
        }}
      />
    </div>
  );
} 