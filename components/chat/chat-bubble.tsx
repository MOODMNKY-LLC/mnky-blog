'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageLoading from "./message-loading";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Pencil, 
  Trash2
} from 'lucide-react';
import { MessageEditor } from '@/components/community/chat/MessageEditor';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from "react"
import { AvatarCircles } from "@/components/avatar-circles";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  email?: string;
  updated_at?: string;
  created_at?: string;
  role?: string;
}

// ChatBubbleAvatar component
interface ChatBubbleAvatarProps {
  profile: Profile | null;
  isAI?: boolean;
}

export const ChatBubbleAvatar = React.forwardRef<HTMLDivElement, ChatBubbleAvatarProps>(
  ({ profile, isAI }, ref) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
      if (isAI) {
        setAvatarUrl('/blog-mnky-avatar.png');
        return;
      }

      if (profile?.avatar_url) {
        downloadImage(profile.avatar_url);
      }
    }, [isAI, profile?.avatar_url]);

    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path);
        
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Error downloading image: ', error);
      }
    }

    const fallbackText = useMemo(() => {
      if (isAI) return 'AI';
      if (!profile) return 'U';
      return profile.full_name?.charAt(0) || 
             profile.username?.charAt(0) || 
             profile.email?.charAt(0) || 
             'U';
    }, [profile, isAI]);

    return (
      <div ref={ref} className="flex-shrink-0">
        <Avatar className="h-8 w-8 border border-zinc-800/50">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={isAI ? 'Blog MNKY' : profile?.full_name || 'User Avatar'}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-zinc-900/50 text-amber-500">
              {fallbackText}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    );
  }
);
ChatBubbleAvatar.displayName = "ChatBubbleAvatar";

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-3 max-w-[80%] relative group",
  {
    variants: {
      variant: {
        received: "self-start items-start",
        sent: "self-end flex-row-reverse items-end",
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

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatBubbleVariant> {
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
      pinned?: boolean;
      pinned_at?: string;
      reactions?: Array<{
        emoji: string;
        count: number;
        users: string[];
      }>;
    };
  };
  profile?: Profile | null;
  position?: 'first' | 'middle' | 'last' | 'single';
  onDelete?: (id: string) => void;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, message, profile, position = 'single', onDelete, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const { user } = useUser();
    const isOwner = user?.id === (message.user_id || message.user?.id);
    const timestamp = message.created_at || message.createdAt || new Date().toISOString();
    const messageContent = message.message || message.content || '';
    const isSent = variant === 'sent';

    const displayName = useMemo(() => {
      if (variant === 'received' && !message.user_id) {
        return (
          <>
            <span className="text-amber-500">BLOG</span>{" "}
            <span className="text-zinc-400">MNKY</span>
          </>
        );
      }
      
      const name = profile?.display_name || profile?.full_name || profile?.username || 'Guest User';
      const parts = name.split(' ');
      
      if (parts.length >= 2) {
        return (
          <>
            <span className="text-amber-500">{parts[0]}</span>{" "}
            <span className="text-zinc-400">{parts.slice(1).join(' ')}</span>
          </>
        );
      }
      
      return <span className="text-amber-500">{name}</span>;
    }, [variant, message.user_id, profile]);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const handleSaveEdit = (messageId: string, content: string) => {
      setIsEditing(false);
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
        <ChatBubbleAvatar 
          profile={profile || null}
          isAI={variant === 'received' && !message.user_id}
        />
        <div className={cn(
          "flex-1",
          isSent && "flex flex-col items-end"
        )}>
          <div className={cn(
            "flex flex-col gap-1",
            isSent && "items-end"
          )}>
            <div className={cn(
              "flex items-center gap-2",
              isSent && "flex-row-reverse"
            )}>
              <span className="text-sm font-medium">
                {displayName}
              </span>
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
                  <div className={cn(
                    "text-zinc-200 break-words",
                    isSent && "text-right"
                  )}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ className, children }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return (
                            <code className={cn(
                              "bg-zinc-900/50 rounded px-1.5 py-0.5 text-sm",
                              match && `language-${match[1]}`
                            )}>
                              {children}
                            </code>
                          );
                        },
                        a({ children, href, ...props }) {
                          return (
                            <a 
                              href={href}
                              className="text-amber-500 hover:text-amber-600 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                        blockquote({ children, ...props }) {
                          return (
                            <blockquote 
                              className={cn(
                                "border-l-4 border-amber-500/20 pl-4 italic text-zinc-400",
                                isSent && "border-r-4 border-l-0 pr-4 pl-0"
                              )}
                              {...props}
                            >
                              {children}
                            </blockquote>
                          );
                        },
                        h1: ({ children, ...props }) => (
                          <h1 className={cn(
                            "text-2xl font-bold mb-4",
                            isSent && "text-right"
                          )} {...props}>{children}</h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className={cn(
                            "text-xl font-bold mb-3",
                            isSent && "text-right"
                          )} {...props}>{children}</h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className={cn(
                            "text-lg font-bold mb-2",
                            isSent && "text-right"
                          )} {...props}>{children}</h3>
                        ),
                        ul: ({ children, ...props }) => (
                          <ul className={cn(
                            "list-disc list-inside mb-4",
                            isSent && "text-right"
                          )} {...props}>{children}</ul>
                        ),
                        ol: ({ children, ...props }) => (
                          <ol className={cn(
                            "list-decimal list-inside mb-4",
                            isSent && "text-right"
                          )} {...props}>{children}</ol>
                        ),
                        table: ({ children, ...props }) => (
                          <div className="overflow-x-auto mb-4">
                            <table className={cn(
                              "min-w-full divide-y divide-zinc-800",
                              isSent && "ml-auto"
                            )} {...props}>
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children, ...props }) => (
                          <th className="px-4 py-2 text-left text-zinc-400 font-medium bg-zinc-800/50" {...props}>
                            {children}
                          </th>
                        ),
                        td: ({ children, ...props }) => (
                          <td className="px-4 py-2 border-t border-zinc-800" {...props}>
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {messageContent}
                    </ReactMarkdown>
                  </div>
                  {isOwner && (
                    <div className={cn(
                      "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900/50 backdrop-blur-sm rounded-full p-1",
                      isSent ? "-left-2" : "-right-2"
                    )}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-transparent p-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                        onClick={handleEdit}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-transparent p-0 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => onDelete?.(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ChatBubble.displayName = "ChatBubble";

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

export interface ChatBubbleActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full hover:bg-zinc-800/50",
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  );
};

export interface ChatBubbleActionWrapperProps {
  children: React.ReactNode;
}

export const ChatBubbleActionWrapper: React.FC<ChatBubbleActionWrapperProps> = ({
  children
}) => {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      {children}
    </div>
  );
};

export {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
};
