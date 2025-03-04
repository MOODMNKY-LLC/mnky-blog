'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useAuth } from '@/lib/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_system?: boolean;
  user: {
    id: string;
    email: string;
    avatar_url?: string;
    role: 'user' | 'admin' | 'moderator';
  };
}

interface ChatProps {
  channelId: string;
}

export function Chat({ channelId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            user:user_id (
              id,
              email,
              avatar_url,
              role:user_roles(role)
            )
          `)
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Transform the data to match our Message type
        const transformedData = data?.map(message => ({
          ...message,
          user: {
            ...message.user,
            role: message.user.role?.[0]?.role || 'user'
          }
        })) || [];
        
        setMessages(transformedData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete message with user information
            const { data: messageData } = await supabase
              .from('messages')
              .select(`
                *,
                user:user_id (
                  id,
                  email,
                  avatar_url,
                  role:user_roles(role)
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (messageData) {
              const transformedMessage = {
                ...messageData,
                user: {
                  ...messageData.user,
                  role: messageData.user.role?.[0]?.role || 'user'
                }
              };
              setMessages((prev) => [...prev, transformedMessage]);
            }
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId, supabase, toast]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-zinc-500">Please sign in to join the chat.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList channelId={channelId} messages={messages} />
      </div>
      <ChatInput channelId={channelId} />
    </div>
  );
} 