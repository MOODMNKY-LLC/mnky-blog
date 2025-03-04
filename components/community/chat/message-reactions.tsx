import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EmojiMartData } from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSupabase } from '@/components/supabase/provider';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

// Frequently used reactions that appear at the top
const QUICK_REACTIONS = [
  { emoji: '👍', name: 'thumbs_up', tooltip: 'Like' },
  { emoji: '❤️', name: 'heart', tooltip: 'Love' },
  { emoji: '😄', name: 'smile', tooltip: 'Smile' },
  { emoji: '🎉', name: 'tada', tooltip: 'Celebrate' },
  { emoji: '🤔', name: 'thinking', tooltip: 'Thinking' },
  { emoji: '😢', name: 'cry', tooltip: 'Sad' },
  { emoji: '😠', name: 'angry', tooltip: 'Angry' },
  { emoji: '🚀', name: 'rocket', tooltip: 'Ship It!' },
] as const;

interface AvailableReaction {
  emoji: string;
  name: string;
  description: string;
}

interface Reaction {
  emoji: string;
  count: number;
  userNames: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  currentUserId?: string;
  isAdmin?: boolean;
  className?: string;
  onReactionSelect: (messageId: string, emoji: string) => void;
}

export function MessageReactions({
  reactions = [],
  messageId,
  currentUserId,
  isAdmin = false,
  className,
  onReactionSelect
}: MessageReactionsProps) {
  const { supabase, user } = useSupabase();
  const [showPicker, setShowPicker] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [availableReactions, setAvailableReactions] = useState<AvailableReaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const quickReactionsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Fetch available reactions on mount
  useEffect(() => {
    const fetchAvailableReactions = async () => {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        toast.error('Unable to load reactions - client not initialized');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching available reactions...');
        
        const { data: reactions, error } = await supabase
          .from('available_reactions')
          .select('emoji, name, description')
          .eq('is_active', true);

        // Log the raw response for debugging
        console.log('Supabase response:', { data: reactions, error });

        if (error) {
          // Log the raw error object first
          console.error('Raw Supabase error:', error);
          
          // Now try to safely access error properties
          const errorDetails = {
            message: error?.message || 'Unknown error',
            code: error?.code || 'NO_CODE',
            details: error?.details || 'No details available',
            hint: error?.hint || 'No hint available'
          };
          
          console.error('Processed Supabase error:', errorDetails);
          
          // Handle specific error cases
          if (errorDetails.code === 'PGRST301') {
            toast.error('Database connection error. Please try again.');
          } else if (errorDetails.code === '42P01') {
            toast.error('Reactions table not found. Please check database setup.');
          } else if (errorDetails.code === '42501') {
            toast.error('Permission denied. Please check your access rights.');
          } else {
            toast.error(`Failed to load reactions: ${errorDetails.message}`);
          }
          return;
        }

        if (!reactions || reactions.length === 0) {
          console.warn('No active reactions found in the database');
          setAvailableReactions([]);
          return;
        }

        console.log('Successfully fetched reactions:', reactions);
        setAvailableReactions(reactions);
      } catch (error) {
        // Log any unexpected errors
        console.error('Unexpected error in fetchAvailableReactions:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        toast.error('An unexpected error occurred while loading reactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableReactions();
  }, [supabase]);

  // Handle clicking outside of quick reactions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickReactionsRef.current && 
        !quickReactionsRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowQuickReactions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if the current user has reacted with a specific emoji
  const hasReacted = (emoji: string): boolean => {
    if (!currentUserId) return false;
    
    const reaction = reactions.find(r => r.emoji === emoji);
    if (!reaction?.userNames) return false;
    
    return reaction.userNames.includes(currentUserId);
  };

  // Handle reaction selection
  const handleReactionSelect = async (emoji: string) => {
    if (!currentUserId) {
      toast.error('Please sign in to react to messages');
      return;
    }

    if (!supabase) {
      console.error('Supabase client is not initialized');
      toast.error('Unable to toggle reaction - client not initialized');
      return;
    }

    setShowQuickReactions(false);
    setShowPicker(false);

    try {
      console.log('Attempting to toggle reaction:', {
        messageId,
        userId: currentUserId,
        emoji
      });

      // Check if the emoji is available
      const isAvailable = availableReactions.some(r => r.emoji === emoji);
      if (!isAvailable) {
        toast.error('This reaction is not available');
        return;
      }

      // Call the onReactionSelect callback with both messageId and emoji
      onReactionSelect(messageId, emoji);
    } catch (error) {
      console.error('Unexpected error in handleReactionSelect:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        toast.error(`Failed to toggle reaction: ${error.message}`);
      } else {
        console.error('Non-Error object thrown:', error);
        toast.error('An unexpected error occurred while toggling reaction');
      }
    }
  };

  // Handle emoji picker selection (admin only)
  const handleEmojiSelect = async (emoji: any) => {
    if (!isAdmin) return;
    await handleReactionSelect(emoji.native);
  };

  return (
    <div className={cn('flex items-center gap-1.5 relative group/reactions', className)}>
      {/* Existing Reactions */}
      <div className="flex flex-wrap gap-1">
        {isLoading ? (
          <div className="animate-pulse bg-zinc-800/50 h-6 w-16 rounded-full" />
        ) : reactions && reactions.length > 0 ? (
          reactions.map(reaction => {
            const availableReaction = availableReactions.find(r => r.emoji === reaction.emoji);
            if (!availableReaction) return null;

            return (
              <TooltipProvider key={reaction.emoji} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-6 px-2 py-1 hover:bg-amber-500/10',
                        'transition-colors duration-200',
                        'flex items-center gap-1 rounded-full',
                        hasReacted(reaction.emoji) && 'bg-amber-500/20 text-amber-500'
                      )}
                      onClick={() => handleReactionSelect(reaction.emoji)}
                      disabled={isLoading}
                    >
                      <span className="text-sm">{reaction.emoji}</span>
                      <span className="text-xs font-medium">
                        {reaction.count || 0}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div>
                      <p className="font-medium">{availableReaction.description}</p>
                      <p className="text-zinc-400">
                        {reaction.userNames && reaction.userNames.length > 0 && (
                          `${reaction.userNames.slice(0, 3).join(', ')}${reaction.userNames.length > 3 ? ` and ${reaction.userNames.length - 3} more` : ''}`
                        )}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })
        ) : null}
      </div>

      {/* Add Reaction Button */}
      {currentUserId && (
        <div className="relative">
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon"
            className={cn(
              'h-6 w-6 rounded-full',
              'hover:bg-amber-500/10',
              'opacity-0 group-hover/reactions:opacity-100',
              'transition-all duration-200',
              showQuickReactions && 'opacity-100 bg-amber-500/20 text-amber-500'
            )}
            onClick={() => setShowQuickReactions(true)}
            disabled={isLoading}
          >
            <Smile className="h-4 w-4" />
          </Button>

          {/* Quick Reactions Popup */}
          {showQuickReactions && (
            <div
              ref={quickReactionsRef}
              className={cn(
                'absolute bottom-full mb-2 left-0',
                'bg-zinc-900/95 backdrop-blur-sm',
                'border border-zinc-800/50',
                'rounded-lg shadow-lg',
                'py-2 px-2',
                'w-[288px]' // Discord-like width (8 emojis * 36px each)
              )}
            >
              {/* Main Reactions Grid */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                {QUICK_REACTIONS.map(({ emoji, name, tooltip }) => (
                  <TooltipProvider key={name} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-9 w-9 p-0',
                            'hover:bg-amber-500/10',
                            'flex items-center justify-center rounded-md',
                            hasReacted(emoji) && 'bg-amber-500/20 text-amber-500'
                          )}
                          onClick={() => handleReactionSelect(emoji)}
                        >
                          <span className="text-xl">{emoji}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="text-xs bg-zinc-900 border-zinc-800"
                      >
                        {tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              {/* Divider and Search/Browse Button */}
              <div className="flex items-center gap-2 px-1">
                <div className="h-px flex-1 bg-zinc-800/50" />
                {isAdmin && (
                  <Popover open={showPicker} onOpenChange={setShowPicker}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-9 w-9 p-0',
                          'hover:bg-amber-500/10',
                          'flex items-center justify-center rounded-md',
                          'text-zinc-400 hover:text-amber-500'
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="start"
                      className="p-0 border-none bg-transparent w-auto"
                    >
                      <div className="rounded-lg overflow-hidden">
                        <Picker
                          onEmojiSelect={handleEmojiSelect}
                          theme="dark"
                          previewPosition="none"
                          skinTonePosition="none"
                          maxFrequentRows={0}
                          navPosition="none"
                          perLine={8}
                          categories={['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags']}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 