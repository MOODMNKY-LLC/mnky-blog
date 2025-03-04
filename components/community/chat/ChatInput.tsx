'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/hooks/use-auth';
import { Send, Loader2, Plus, Smile, Paperclip } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ChatInputProps {
  channelId: string;
}

export function ChatInput({ channelId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  // Focus textarea on mount and after sending a message
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading, message]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !user || isLoading) return;

    setIsLoading(true);
    try {
      // Verify channel exists and user has access
      const { data: channel, error: channelError } = await supabase
        .from('channels')
        .select('id, name')
        .or('id.eq.' + channelId + ',slug.eq.' + channelId)
        .single();

      if (channelError || !channel) {
        console.error('Error verifying channel:', channelError);
        toast({
          variant: "destructive",
          description: "Error verifying channel access"
        });
        return;
      }

      // Insert message
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          channel_id: channel.id,
          message: message.trim(),
          type: 'TEXT',
          user_id: user.id
        });

      if (insertError) {
        console.error('Error sending message:', insertError);
        toast({
          variant: "destructive",
          description: "Error sending message"
        });
        return;
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-end bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-4">
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 text-zinc-400 hover:text-amber-500"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add attachment</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 text-zinc-400 hover:text-amber-500"
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 text-zinc-400 hover:text-amber-500"
          disabled={isLoading}
        >
          <Smile className="h-4 w-4" />
          <span className="sr-only">Add emoji</span>
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-[2.5rem] max-h-[10rem] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
        disabled={isLoading}
      />
      <Button
        size="icon"
        className="shrink-0"
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
} 