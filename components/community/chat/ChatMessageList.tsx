'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/hooks/use-auth';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    avatar_url?: string;
    role: 'admin' | 'moderator' | 'user';
  };
  is_system?: boolean;
}

interface ChatMessageListProps {
  channelId: string;
  messages: Message[];
}

export function ChatMessageList({ channelId, messages }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col py-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              content: message.content,
              createdAt: message.created_at,
              user: {
                id: message.user.id,
                email: message.user.email,
                avatarUrl: message.user.avatar_url,
                role: message.user.role,
              },
              isSystem: message.is_system,
            }}
            isOwn={message.user_id === user?.id}
          />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
} 