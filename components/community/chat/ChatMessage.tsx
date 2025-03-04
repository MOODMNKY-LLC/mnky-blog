'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Bot, Crown, Shield } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      email: string;
      avatarUrl?: string;
      role: 'admin' | 'moderator' | 'user';
    };
    isSystem?: boolean;
  };
  isOwn?: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const getRoleIcon = () => {
    switch (message.user.role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-amber-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-emerald-500" />;
      default:
        return null;
    }
  };

  if (message.isSystem) {
    return (
      <div className="flex items-center justify-center py-2 px-4">
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <Bot className="h-3 w-3" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-4 p-4 transition-colors hover:bg-zinc-900/50',
        isOwn && 'flex-row-reverse'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.user.avatarUrl} />
        <AvatarFallback>
          {message.user.email.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={cn('flex flex-col gap-1', isOwn && 'items-end')}>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn('font-medium text-zinc-200', isOwn && 'order-2')}>
            {message.user.email}
          </span>
          {getRoleIcon()}
          <span className="text-xs text-zinc-400">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
        </div>
        <div
          className={cn(
            'rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-200',
            isOwn && 'bg-amber-500/10 text-amber-500'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
} 