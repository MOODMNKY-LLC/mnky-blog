'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageLoading from "./message-loading";
import { Button, type ButtonProps } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  Reply, 
  Share2, 
  Bookmark,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageEditor } from '@/components/community/chat/MessageEditor';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from "react"
import { AvatarCircles } from "@/components/avatar-circles";

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-3 max-w-[80%] items-end relative group",
  {
    variants: {
      variant: {
        received: "self-start",
        sent: "self-end flex-row-reverse",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full items-start",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  },
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {
  message: {
    id: string;
    message?: string;
    content?: string;
    user_id?: string;
    user?: {
      id: string;
    };
    created_at?: string;
    createdAt?: string;
    is_edited?: boolean;
    edited_at?: string;
    metadata?: {
      edited?: boolean;
      edited_at?: string;
      [key: string]: any;
    };
  };
  profile?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
  position?: 'first' | 'middle' | 'last' | 'single';
  onDelete?: (messageId: string) => void;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, message, profile, position = 'single', onDelete, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const { user } = useUser();
    const isOwner = user?.id === (message.user_id || message.user?.id);
    const timestamp = message.created_at || message.createdAt || new Date().toISOString();
    const messageContent = message.message || message.content || '';

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const handleSaveEdit = (messageId: string, content: string) => {
      setIsEditing(false);
      // Handle the save if needed
    };

    const handleReply = () => {
      // TODO: Implement reply functionality
      console.log('Reply to:', message.id);
    };

    const handleShare = () => {
      // TODO: Implement share functionality
      console.log('Share message:', message.id);
    };

    const handleBookmark = () => {
      // TODO: Implement bookmark functionality
      console.log('Bookmark message:', message.id);
    };

    return (
      <div
        className={cn(
          chatBubbleVariant({ variant, layout, className }),
          "relative group",
          position === 'first' && 'mt-4',
          position === 'middle' && 'mt-1',
          position === 'last' && 'mb-4'
        )}
        ref={ref}
        {...props}
      >
        <ChatBubbleAvatar profile={profile} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-200">{profile?.full_name || 'Unknown User'}</span>
            <span className="text-xs text-zinc-500">
              {format(new Date(timestamp), 'h:mm a')}
            </span>
            {message.is_edited && (
              <span className="text-xs text-zinc-500">(edited)</span>
            )}
          </div>
          <div className="group relative">
            {isEditing ? (
              <MessageEditor
                message={{
                  id: message.id,
                  message: messageContent,
                  metadata: message.metadata || {
                    edited: message.is_edited,
                    edited_at: message.edited_at
                  }
                }}
                onCancel={handleCancelEdit}
                onSave={handleSaveEdit}
              />
            ) : (
              <>
                <div className="text-zinc-200 break-words">{messageContent}</div>
                <ChatBubbleActionWrapper>
                  <ChatBubbleAction
                    icon={<Reply className="h-4 w-4" />}
                    onClick={handleReply}
                  />
                  <ChatBubbleAction
                    icon={<Share2 className="h-4 w-4" />}
                    onClick={handleShare}
                  />
                  <ChatBubbleAction
                    icon={<Bookmark className="h-4 w-4" />}
                    onClick={handleBookmark}
                  />
                  {isOwner && (
                    <>
                      <ChatBubbleAction
                        icon={<Pencil className="h-4 w-4" />}
                        onClick={handleEdit}
                      />
                      <ChatBubbleAction
                        icon={<Trash2 className="h-4 w-4 text-red-500 hover:text-red-400" />}
                        onClick={() => onDelete?.(message.id)}
                        className="hover:bg-red-500/10"
                      />
                    </>
                  )}
                </ChatBubbleActionWrapper>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  profile?: {
    full_name?: string | null
    avatar_url?: string | null
    username?: string | null
  }
}

function ChatBubbleAvatar({ profile }: ChatBubbleAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const supabase = createClient()

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) throw error
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.error('Error downloading avatar:', error)
        setAvatarUrl(undefined)
      }
    }

    if (profile?.avatar_url) {
      downloadImage(profile.avatar_url)
    }
  }, [profile?.avatar_url])

  if (!avatarUrl) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-muted">
          {profile?.full_name
            ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
            : profile?.username?.charAt(0)?.toUpperCase() || '??'}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <AvatarCircles
      avatars={[
        {
          imageUrl: avatarUrl,
          profileUrl: `/community/members/${profile?.username}`
        }
      ]}
      size={32}
      showLink={false}
    />
  )
}

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("px-2 py-2", {
  variants: {
    variant: {
      received:
        "bg-zinc-800/80 text-zinc-100 rounded-2xl rounded-bl-sm",
      sent: "bg-amber-500 text-zinc-900 rounded-2xl rounded-br-sm",
    },
    layout: {
      default: "",
      ai: "border-t border-zinc-800 w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
  isStreaming?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, isStreaming = false, children, ...props },
    ref,
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "break-words max-w-full whitespace-normal backdrop-blur-sm",
        variant === "sent" && "font-medium",
        variant === "received" && "text-amber-500",
        layout === "ai" && "prose prose-zinc dark:prose-invert max-w-none prose-p:mt-2 prose-p:mb-2 prose-headings:mt-3 prose-headings:mb-2 prose-ul:mt-2 prose-ul:mb-2 prose-ol:mt-2 prose-ol:mb-2 prose-pre:mt-2 prose-pre:mb-2 prose-a:text-amber-500 prose-strong:text-amber-500 prose-headings:text-amber-500",
        (isLoading || isStreaming) && "min-h-[2rem]",
        isStreaming && "animate-pulse"
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        <>
          {children}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 -mb-0.5 bg-amber-500 animate-pulse" />
          )}
        </>
      )}
    </div>
  ),
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn("text-xs mt-2 text-right", className)} {...props}>
    {timestamp}
  </div>
);

// ChatBubbleAction
type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode;
};

const ChatBubbleAction = React.forwardRef<HTMLButtonElement, ChatBubbleActionProps>(
  ({ icon, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "h-6 w-6 rounded-full bg-transparent p-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  )
);
ChatBubbleAction.displayName = "ChatBubbleAction";

// ChatBubbleActionWrapper
interface ChatBubbleActionWrapperProps {
  children: React.ReactNode;
}

const ChatBubbleActionWrapper = React.forwardRef<HTMLDivElement, ChatBubbleActionWrapperProps>(
  ({ children }, ref) => (
    <div
      ref={ref}
      className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900/50 backdrop-blur-sm rounded-full p-1"
    >
      {children}
    </div>
  )
);
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
};
