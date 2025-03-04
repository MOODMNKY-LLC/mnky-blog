'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X, Check } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  metadata: {
    edited?: boolean;
    edited_at?: string;
    [key: string]: any;
  };
}

interface MessageEditorProps {
  message: Message;
  onSave: (messageId: string, content: string) => void;
  onCancel: () => void;
}

export function MessageEditor({ message, onSave, onCancel }: MessageEditorProps) {
  const [content, setContent] = useState(message.message);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleSave = async () => {
    if (!content.trim() || isLoading || content.trim() === message.message) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('messages')
        .update({
          message: content.trim(),
          metadata: {
            edited: true,
            edited_at: new Date().toISOString()
          }
        })
        .eq('id', message.id);

      if (error) {
        throw error;
      }

      onSave(message.id, content.trim());
      toast({
        description: "Message updated successfully"
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] resize-none"
        placeholder="Edit your message..."
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
} 