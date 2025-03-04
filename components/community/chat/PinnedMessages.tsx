'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Pin, X, Search, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  username: string;
  avatar_url: string | null;
  display_name: string | null;
}

interface PinnedMessage {
  id: string;
  content: string;
  created_at: string;
  profile: Profile;
  metadata: {
    pinned: boolean;
    pinned_at: string;
    pinned_by: string;
  };
}

interface MessageFromDB {
  id: string;
  message: string;
  created_at: string;
  metadata: any;
  profiles: {
    username: string;
    avatar_url: string | null;
    display_name: string | null;
  };
}

interface PinnedMessagesProps {
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageClick: (messageId: string) => void;
}

export function PinnedMessages({ channelId, open, onOpenChange, onMessageClick }: PinnedMessagesProps) {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      fetchPinnedMessages();
    }
  }, [channelId, open]);

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(avatarUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [avatarUrls]);

  async function downloadAvatar(path: string, username: string) {
    try {
      const supabaseClient = createClient();
      const { data, error } = await supabaseClient.storage.from('avatars').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrls(prev => ({ ...prev, [username]: url }));
    } catch (error) {
      console.error('Error downloading avatar:', error);
    }
  }

  async function fetchPinnedMessages() {
    try {
      console.log('Fetching pinned messages for channel:', channelId);

      // First verify the channel exists
      const { data: channel, error: channelError } = await supabase
        .from('channels')
        .select('id')
        .eq('id', channelId)
        .single();

      if (channelError) {
        console.error('Error verifying channel:', {
          error: channelError,
          channelId
        });
        throw new Error('Failed to verify channel access');
      }

      if (!channel) {
        console.error('Channel not found:', channelId);
        throw new Error('Channel not found');
      }

      // Then fetch messages with profiles
      const { data, error } = await supabase
        .from('messages_with_profiles')
        .select(`
          id,
          message,
          created_at,
          metadata,
          username,
          avatar_url,
          display_name
        `)
        .eq('channel_id', channelId)
        .eq('metadata->>pinned', 'true')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching pinned messages:', {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          },
          channelId
        });
        throw new Error(error.message || 'Failed to fetch pinned messages');
      }

      if (!data) {
        console.log('No pinned messages found for channel:', channelId);
        setPinnedMessages([]);
        return;
      }

      console.log('Fetched pinned messages:', {
        count: data.length,
        messages: data
      });

      const transformedData: PinnedMessage[] = data.map(message => ({
        id: message.id,
        content: message.message,
        created_at: message.created_at,
        profile: {
          username: message.username || 'Unknown User',
          avatar_url: message.avatar_url || '',
          display_name: message.display_name || null
        },
        metadata: message.metadata || {}
      }));

      setPinnedMessages(transformedData);

      // Download avatars for all messages
      transformedData.forEach(message => {
        if (message.profile.avatar_url) {
          downloadAvatar(message.profile.avatar_url, message.profile.username);
        }
      });
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      } : {
        message: 'Unknown error occurred',
        error
      };

      console.error('Error fetching pinned messages:', errorDetails);
      
      toast({
        title: 'Error Loading Messages',
        description: errorDetails.message,
        variant: 'destructive',
      });

      setPinnedMessages([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredMessages = searchQuery
    ? pinnedMessages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.profile.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pinnedMessages;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-zinc-900/95 border-zinc-800">
        <DialogHeader className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-zinc-100">
              <Pin className="h-4 w-4 text-amber-500" />
              <span>Pinned Messages</span>
              <span className="text-xs text-zinc-400 ml-2">
                {pinnedMessages.length} {pinnedMessages.length === 1 ? 'message' : 'messages'}
              </span>
            </DialogTitle>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pinned messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-zinc-800/50 border-zinc-700 focus-visible:ring-amber-500/20 text-zinc-100"
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-2 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-20 text-zinc-400">
                Loading...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 text-zinc-400">
                <Pin className="h-8 w-8 mb-2 text-zinc-500" />
                {searchQuery ? 'No messages found' : 'No pinned messages'}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <button
                  key={message.id}
                  className="w-full text-left rounded-lg transition-colors group relative"
                  onClick={() => {
                    onMessageClick(message.id);
                    onOpenChange(false);
                  }}
                >
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 pr-8">
                    <Avatar className="h-9 w-9 rounded-full">
                      {avatarUrls[message.profile.username] ? (
                        <AvatarImage 
                          src={avatarUrls[message.profile.username]} 
                          alt={message.profile.display_name || message.profile.username} 
                        />
                      ) : (
                        <AvatarFallback className="bg-zinc-900 text-amber-500">
                          {(message.profile.display_name?.[0] || message.profile.username[0]).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-zinc-100">
                          {message.profile.display_name || message.profile.username}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {format(new Date(message.created_at), 'MMM d, yyyy')}
                        </span>
                        <Pin className="h-3 w-3 text-amber-500" />
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-2 mb-1">{message.content}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>Pinned {formatDistanceToNow(new Date(message.metadata.pinned_at), { addSuffix: true })}</span>
                        <span className="text-zinc-600">•</span>
                        <span>Click to jump</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 