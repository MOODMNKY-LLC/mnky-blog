'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  type Profile
} from '@/components/chat/chat-bubble';
import { cn } from '@/lib/utils';
import { Smile, MoreHorizontal, Trash2, Pin, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { type User } from '@supabase/supabase-js';
import { MessageReactions } from './message-reactions';
import { MessageEditor } from './MessageEditor';
import { PinnedMessages } from './PinnedMessages';
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { ChatHeader } from './ChatHeader';
import { type Message, type MessageWithProfile, type MessageMetadata } from '@/lib/types/chat';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Attachment {
  type: string;
  url: string;
}

interface ChatMessagesProps {
  channelId: string;
  currentUser: User | null;
  showPinnedMessages: boolean;
  onTogglePinnedMessages: () => void;
  searchQuery?: string;
}

interface MessagesByDate {
  [key: string]: Message[];
}

function groupMessagesByDate(messages: Message[]): [string, Message[]][] {
  const groups = messages.reduce((acc: MessagesByDate, message: Message) => {
    const date = format(new Date(message.created_at), 'MMMM d, yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return Object.entries(groups);
}

export function ChatMessages({ 
  channelId, 
  currentUser, 
  showPinnedMessages, 
  onTogglePinnedMessages,
  searchQuery = ''
}: ChatMessagesProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll function
  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.target as HTMLDivElement;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Scroll to bottom on new messages
  React.useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  // Filter messages when search query changes
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMessages(messages);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = messages.filter(message => 
      message.message.toLowerCase().includes(query) ||
      message.profile.username.toLowerCase().includes(query) ||
      message.profile.display_name?.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  // Fetch messages function
  const fetchMessages = React.useCallback(async () => {
    if (!channelId) return;

    try {
      const { data, error } = await supabase
        .from('messages_with_profiles')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages. Please try again.',
        variant: 'destructive',
      });
    }
  }, [channelId, supabase, toast]);

  // Fetch initial messages
  React.useEffect(() => {
    async function fetchMessages() {
      if (!channelId) {
        console.error('No channel ID provided');
        toast({
          title: 'Error',
          description: 'Invalid channel configuration. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching messages for channel:', channelId);
        
        // First verify the channel exists by ID or slug
        const { data: channel, error: channelError } = await supabase
          .from('channels')
          .select('id, name')
          .or(`id.eq.${channelId},slug.eq.${channelId}`)
          .single();

        const channelLookupDetails = {
          channelId,
          found: !!channel,
          error: channelError ? {
            message: channelError.message,
            code: channelError.code,
            details: channelError.details,
            hint: channelError.hint
          } : null,
          query: `id.eq.${channelId},slug.eq.${channelId}`,
          isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(channelId)
        };

        console.log('Channel lookup result:', channelLookupDetails);

        if (channelError) {
          console.error('Error verifying channel:', channelLookupDetails);
          throw new Error(`Failed to verify channel access: ${channelError.message}`);
        }

        if (!channel) {
          console.error('Channel not found:', channelLookupDetails);
          throw new Error('Channel not found');
        }

        // Use the actual channel ID for subsequent queries
        const actualChannelId = channel.id;

        // Verify auth status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Error verifying auth session:', {
            error: sessionError,
            userId: currentUser?.id
          });
          throw new Error('No valid auth session');
        }

        // Fetch messages with profiles using actual channel ID
        const { data, error } = await supabase
          .from('messages_with_profiles')
          .select(`
            id,
            channel_id,
            user_id,
            message,
            type,
            parent_id,
            metadata,
            created_at,
            updated_at,
            deleted_at,
            username,
            avatar_url,
            display_name,
            user_role
          `)
          .eq('channel_id', actualChannelId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching messages:', {
            error: {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            },
            channelId: actualChannelId,
            type: 'database_error'
          });
          throw new Error(error.message || 'Failed to fetch messages');
        }

        if (!data) {
          console.log('No messages found for channel:', channelId);
          setMessages([]);
          setHasMoreMessages(false);
          return;
        }

        // Transform the data to match the Message type
        const transformedMessages = (data as unknown as MessageWithProfile[]).map(msg => {
          // Ensure we have valid profile data
          const profile = {
            username: msg.username || 'Unknown User',
            avatar_url: msg.avatar_url || null,
            display_name: msg.display_name || msg.username || 'Unknown User',
            role: msg.user_role || 'user'
          };

          return {
            id: msg.id,
            channel_id: msg.channel_id,
            user_id: msg.user_id,
            message: msg.message,
            type: msg.type,
            parent_id: msg.parent_id,
            metadata: msg.metadata || {},
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            deleted_at: msg.deleted_at,
            profile
          };
        });

        console.log('Successfully fetched messages:', {
          count: transformedMessages.length,
          channelId,
          hasMore: transformedMessages.length === 50
        });

        setMessages(transformedMessages.reverse());
        setHasMoreMessages(transformedMessages.length === 50);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorDetails = {
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          channelId,
          type: typeof error,
          code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
          details: error instanceof Error && 'details' in error ? (error as any).details : undefined,
          hint: error instanceof Error && 'hint' in error ? (error as any).hint : undefined,
          name: error instanceof Error ? error.name : undefined,
          raw: error // Include raw error for debugging
        };

        console.error('Error fetching messages:', errorDetails);
        
        toast({
          title: 'Error Loading Messages',
          description: errorMessage,
          variant: 'destructive',
        });

        // Reset state on error
        setMessages([]);
        setHasMoreMessages(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [channelId, supabase, toast, currentUser?.id]);

  // Load more messages
  const loadMoreMessages = async () => {
    if (!channelId) {
      console.error('No channel ID provided');
      return;
    }

    if (loadingMore || !hasMoreMessages || messages.length === 0) {
      console.log('Skipping loadMoreMessages:', {
        loadingMore,
        hasMoreMessages,
        messagesLength: messages.length
      });
      return;
    }

    try {
      setLoadingMore(true);
      console.log('Loading more messages for channel:', {
        channelId,
        oldestMessageDate: messages[0]?.created_at
      });

      // First verify the channel exists by ID or slug
      const { data: channel, error: channelError } = await supabase
        .from('channels')
        .select('id, name')
        .or(`id.eq.${channelId},slug.eq.${channelId}`)
        .single();

      if (channelError) {
        console.error('Error verifying channel:', {
          error: channelError,
          channelId,
          type: 'string or uuid'
        });
        throw new Error('Failed to verify channel access');
      }

      if (!channel) {
        console.error('Channel not found:', channelId);
        throw new Error('Channel not found');
      }

      // Use the actual channel ID for subsequent queries
      const actualChannelId = channel.id;

      // Then fetch more messages using actual channel ID
      const { data: moreMessages, error: loadError } = await supabase
        .from('messages_with_profiles')
        .select(`
          id,
          channel_id,
          user_id,
          message,
          type,
          parent_id,
          metadata,
          created_at,
          updated_at,
          deleted_at,
          username,
          avatar_url,
          display_name,
          user_role
        `)
        .eq('channel_id', actualChannelId)
        .lt('created_at', messages[messages.length - 1].created_at)
        .order('created_at', { ascending: false })
        .limit(50);

      if (loadError) {
        console.error('Database error loading more messages:', {
          error: loadError,
          channelId,
          errorMessage: loadError.message,
          errorCode: loadError.code,
          details: loadError.details,
          hint: loadError.hint
        });
        throw new Error(loadError.message || 'Failed to load more messages');
      }

      if (!moreMessages || moreMessages.length === 0) {
        console.log('No more messages found for channel:', channelId);
        setHasMoreMessages(false);
        return;
      }

      // Transform the data to match the Message type
      const transformedMessages = (moreMessages as unknown as MessageWithProfile[]).map(msg => {
        // Ensure we have valid profile data
        const profile = {
          username: msg.username || 'Unknown User',
          avatar_url: msg.avatar_url || null,
          display_name: msg.display_name || msg.username || 'Unknown User',
          role: msg.user_role || 'user'
        };

        return {
          id: msg.id,
          channel_id: msg.channel_id,
          user_id: msg.user_id,
          message: msg.message,
          type: msg.type,
          parent_id: msg.parent_id,
          metadata: msg.metadata || {},
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          deleted_at: msg.deleted_at,
          profile
        };
      });

      console.log('Successfully loaded more messages:', {
        count: transformedMessages.length,
        channelId,
        hasMore: transformedMessages.length === 50,
        oldestNewMessage: transformedMessages[transformedMessages.length - 1]?.created_at
      });

      setMessages(prev => [...transformedMessages.reverse(), ...prev]);
      setHasMoreMessages(transformedMessages.length === 50);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorDetails = {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        channelId,
        type: typeof error,
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
        details: error instanceof Error && 'details' in error ? (error as any).details : undefined,
        hint: error instanceof Error && 'hint' in error ? (error as any).hint : undefined,
        name: error instanceof Error ? error.name : undefined,
        raw: error // Include raw error for debugging
      };

      console.error('Error loading more messages:', errorDetails);
      
      toast({
        title: 'Error Loading More Messages',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // Subscribe to new messages
  React.useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete message with profile
            const { data, error } = await supabase
              .from('messages_with_profiles')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              setMessages(prev => [data, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, supabase]);

  const handleReply = async (messageId: string) => {
    // Implement reply functionality
    console.log('Reply to message:', messageId);
  };

  const handleReactionSelect = async (messageId: string, emoji: string) => {
    if (!currentUser) return;

    try {
      console.log('Attempting to update reaction:', {
        messageId,
        emoji,
        userId: currentUser.id
      });

      // Get the current message from the base messages table
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .select('metadata')
        .eq('id', messageId)
        .single();

      if (messageError) {
        console.error('Error fetching message:', {
          code: messageError.code,
          message: messageError.message,
          details: messageError.details
        });
        throw messageError;
      }

      if (!message) {
        console.error('Message not found:', messageId);
        throw new Error('Message not found');
      }

      // Ensure metadata and reactions are properly initialized
      const metadata = message.metadata || {};
      const currentReactions = (metadata.reactions || []) as Reaction[];
      let updatedReactions = [...currentReactions];
      
      // Find if this reaction already exists
      const existingReactionIndex = currentReactions.findIndex((r: Reaction) => r.emoji === emoji);
      const hasReacted = existingReactionIndex !== -1 && 
        currentReactions[existingReactionIndex].users?.includes(currentUser.id);

      if (hasReacted) {
        // Remove user from the reaction
        const reaction = updatedReactions[existingReactionIndex];
        reaction.users = (reaction.users || []).filter((userId: string) => userId !== currentUser.id);
        reaction.count = reaction.users.length;

        // Remove the reaction entirely if no users left
        if (reaction.count === 0) {
          updatedReactions = updatedReactions.filter(r => r.emoji !== emoji);
        }
      } else {
        if (existingReactionIndex !== -1) {
          // Add user to existing reaction
          const reaction = updatedReactions[existingReactionIndex];
          reaction.users = [...(reaction.users || []), currentUser.id];
          reaction.count = reaction.users.length;
        } else {
          // Create new reaction
          updatedReactions.push({
            emoji,
            count: 1,
            users: [currentUser.id]
          });
        }
      }

      // Prepare the updated metadata
      const updatedMetadata = {
        ...metadata,
        reactions: updatedReactions
      };

      console.log('Updating message with metadata:', {
        messageId,
        metadata: updatedMetadata
      });

      // Optimistically update the UI
      setMessages(prevMessages => 
        prevMessages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                metadata: updatedMetadata
              }
            : msg
        )
      );

      // Update the message metadata in the database
      const { error: updateError } = await supabase
        .from('messages')
        .update({
          metadata: updatedMetadata
        })
        .eq('id', messageId);

      if (updateError) {
        console.error('Error updating message metadata:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw updateError;
      }

      console.log('Successfully updated reaction');

    } catch (error) {
      console.error('Error updating reaction:', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      });

      // Revert the optimistic update
      const { data: originalMessage } = await supabase
        .from('messages')
        .select('metadata')
        .eq('id', messageId)
        .single();

      if (originalMessage) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId
              ? { ...msg, metadata: originalMessage.metadata }
              : msg
          )
        );
      }

      toast({
        title: 'Error',
        description: error instanceof Error && error.message === 'Message not found'
          ? 'Message not found or was deleted'
          : 'Failed to update reaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!currentUser) return;

    try {
      // Delete from the messages table, not the view
      const { error } = await supabase
        .from('messages')
        .update({ 
          deleted_at: new Date().toISOString(),
          metadata: {
            deleted: true,
            deleted_by: currentUser.id,
            deleted_at: new Date().toISOString()
          }
        })
        .eq('id', messageId)
        .eq('user_id', currentUser.id); // Ensure user owns the message

      if (error) {
        console.error('Error deleting message:', {
          error: {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          },
          messageId,
          userId: currentUser.id
        });
        throw error;
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { 
                ...msg, 
                deleted_at: new Date().toISOString(),
                metadata: {
                  ...msg.metadata,
                  deleted: true,
                  deleted_by: currentUser.id,
                  deleted_at: new Date().toISOString()
                }
              }
            : msg
        )
      );

      toast({
        description: 'Message deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        variant: "destructive",
        description: 'Failed to delete message. Please try again.'
      });
    }
  };

  const handlePin = async (messageId: string) => {
    if (!currentUser) return;

    try {
      // Get the current message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .select('metadata')
        .eq('id', messageId)
        .single();

      if (messageError) throw messageError;

      // Toggle pin status
      const isPinned = message.metadata?.pinned || false;
      const updatedMetadata = {
        ...message.metadata,
        pinned: !isPinned,
        pinned_at: !isPinned ? new Date().toISOString() : null,
        pinned_by: !isPinned ? currentUser.id : null
      };

      // Update the message
      const { error: updateError } = await supabase
        .from('messages')
        .update({
          metadata: updatedMetadata
        })
        .eq('id', messageId)
        .eq('channel_id', channelId); // Ensure message belongs to current channel

      if (updateError) throw updateError;

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                metadata: updatedMetadata
              }
            : msg
        )
      );

      toast({
        description: `Message ${isPinned ? 'unpinned' : 'pinned'} successfully.`
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (messageId: string) => {
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleSaveEdit = () => {
    setEditingMessageId(null);
    // Refresh messages to get the updated content
    fetchMessages();
  };

  const handleShare = async (messageId: string) => {
    // Implement share functionality
    console.log('Share message:', messageId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    return {
      ...groups,
      [date]: [...(groups[date] || []), message],
    };
  }, {} as Record<string, Message[]>);

  function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  // Update the profile type in the message loading skeleton
  const MessageLoadingSkeleton = () => (
    <div className="flex items-start gap-4 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  const renderMessage = (message: MessageWithProfile) => {
    const profile: Profile = {
      id: message.user_id || 'anonymous',
      username: message.profile.username || null,
      full_name: message.profile.display_name || null,
      display_name: message.profile.display_name || null,
      avatar_url: message.profile.avatar_url,
      role: message.profile.role || 'user'
    };

    return (
      <ChatBubble
        key={message.id}
        variant={message.user_id === currentUser?.id ? 'sent' : 'received'}
        message={{
          id: message.id,
          message: message.message,
          user_id: message.user_id,
          created_at: message.created_at,
          metadata: message.metadata
        }}
        profile={profile}
        onDelete={handleDelete}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-zinc-100">
              {profile?.display_name || profile?.username || 'Unknown User'}
            </span>
            {profile?.role && profile.role !== 'user' && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                {profile.role}
              </span>
            )}
            <span className="text-xs text-zinc-400">
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
            {message.metadata.edited && (
              <span className="text-xs text-zinc-500">(edited)</span>
            )}
            {message.metadata.pinned && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Pin className="h-3 w-3" />
                <span>
                  Pinned {message.metadata.pinned_at && formatTimestamp(message.metadata.pinned_at)}
                </span>
              </div>
            )}
          </div>

          {message.deleted_at && (
            <div className="text-sm text-muted-foreground italic">
              This message was deleted
            </div>
          )}

          {!message.deleted_at && (
            <>
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.message}
              </div>
              <MessageReactions
                messageId={message.id}
                reactions={message.metadata.reactions || []}
                onReactionSelect={handleReactionSelect}
              />
            </>
          )}

          {/* Message Actions */}
          {!message.deleted_at && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                  onClick={() => handleReactionSelect(message.id, '👍')}
                >
                  <Smile className="h-4 w-4 text-zinc-400" />
                </Button>
                {message.user_id === currentUser?.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                      onClick={() => setEditingMessageId(message.id)}
                    >
                      <Pencil className="h-4 w-4 text-zinc-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </ChatBubble>
    );
  };

  return (
    <ScrollArea 
      className="h-full" 
      onScroll={handleScroll}
    >
      <div className="flex flex-col py-4 pb-36">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MessageLoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Load More Messages Button */}
        {hasMoreMessages && !isLoading && (
          <div className="flex justify-center py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMoreMessages}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}

        {/* Messages Content */}
        {!isLoading && groupMessagesByDate(filteredMessages).map(([date, dateMessages]) => {
          const filteredDateMessages = searchQuery 
            ? dateMessages.filter((msg: Message) => filteredMessages.some(fm => fm.id === msg.id))
            : dateMessages;

          if (filteredDateMessages.length === 0) return null;

          return (
            <div key={date} className="space-y-4">
              <div className="sticky top-0 z-10 flex justify-center py-2">
                <div className="bg-zinc-800/50 px-3 py-1.5 rounded-full text-sm text-zinc-400">
                  {date}
                </div>
              </div>

              {filteredDateMessages.map((message: Message) => {
                const isSender = currentUser?.id === message.user_id;
                const isDeleted = !!message.deleted_at;
                const profile = message.profile;

                if (editingMessageId === message.id) {
                  return (
                    <MessageEditor
                      key={message.id}
                      message={message}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingMessageId(null)}
                    />
                  );
                }

                return (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={cn(
                      "group relative flex items-start gap-2 py-1 px-4 hover:bg-zinc-800/20 transition-colors duration-200",
                      searchQuery && message.message.toLowerCase().includes(searchQuery.toLowerCase()) && "bg-amber-500/5"
                    )}
                  >
                    <ChatBubbleAvatar
                      profile={{
                        id: message.user_id || 'anonymous',
                        username: message.profile.username || null,
                        full_name: message.profile.display_name || null,
                        display_name: message.profile.display_name || null,
                        avatar_url: message.profile.avatar_url,
                        role: message.profile.role || 'user'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-100">
                          {profile?.display_name || profile?.username || 'Unknown User'}
                        </span>
                        {profile?.role && profile.role !== 'user' && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                            {profile.role}
                          </span>
                        )}
                        <span className="text-xs text-zinc-400">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                        {message.metadata.edited && (
                          <span className="text-xs text-zinc-500">(edited)</span>
                        )}
                        {message.metadata.pinned && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Pin className="h-3 w-3" />
                            <span>
                              Pinned {message.metadata.pinned_at && formatTimestamp(message.metadata.pinned_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {isDeleted ? (
                        <div className="text-sm text-muted-foreground italic">
                          This message was deleted
                        </div>
                      ) : (
                        <>
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {message.message}
                          </div>
                          <MessageReactions
                            messageId={message.id}
                            reactions={message.metadata.reactions || []}
                            onReactionSelect={handleReactionSelect}
                          />
                        </>
                      )}

                      {/* Message Actions */}
                      {!isDeleted && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                              onClick={() => handleReactionSelect(message.id, '👍')}
                            >
                              <Smile className="h-4 w-4 text-zinc-400" />
                            </Button>
                            {isSender && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                                  onClick={() => setEditingMessageId(message.id)}
                                >
                                  <Pencil className="h-4 w-4 text-zinc-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-zinc-700/50"
                                  onClick={() => handleDelete(message.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-zinc-400" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
} 