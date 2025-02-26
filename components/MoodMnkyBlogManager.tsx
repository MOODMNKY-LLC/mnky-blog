'use client';

// app/components/MoodMnkyBlogManager.tsx

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat/chat-bubble";
import { ChatMessageList } from "./chat/chat-message-list";
import { ChatInput } from "./chat/chat-input";
import MessageLoading from "./chat/message-loading";
import { cn } from "@/lib/utils";
import styles from "@/styles/flame-head.module.css";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Copy, Speaker } from "lucide-react";
import { FlowiseService, type IMessage as FlowiseIMessage, type MessageType, type FlowiseStreamResponse } from '@/lib/flowise/client';
import { createBrowserClient } from '@supabase/ssr';

// Message types
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  pending?: boolean;
  error?: boolean;
  config?: Record<string, unknown>;
  avatar?: string;
}

interface IMessage {
  message: string;
  type: 'user' | 'assistant' | 'system';
}

// Add type definitions for Flowise SDK
interface FlowiseUploadResponse {
  filepath: string;
}

interface FlowiseStream {
  subscribe(handlers: {
    next: (message: FlowiseStreamResponse | string) => void;
    error: (error: Error) => void;
    complete: () => void;
  }): Promise<void>;
}

interface FlowiseMessage extends FlowiseIMessage {
  message: string;
  type: MessageType;
}

interface FlowiseStreamChunk {
  event: 'start' | 'token' | 'error' | 'end' | 'metadata' | 'sourceDocuments' | 'usedTools';
  data?: unknown;
}

interface FlowiseConfig {
  // Chat Behavior
  temperature?: number;          // Controls response randomness (0-1)
  maxTokens?: number;           // Max tokens in response
  topP?: number;                // Nucleus sampling parameter
  frequencyPenalty?: number;    // Penalize frequent tokens
  presencePenalty?: number;     // Penalize repeated information
  
  // Memory & Context
  memoryType?: 'chat' | 'buffer' | 'summary';  // Type of memory to use
  messageWindow?: number;       // Number of messages to keep in context
  
  // Response Formatting
  systemPrompt?: string;        // Override system prompt
  responseFormat?: {
    type: 'markdown' | 'plain' | 'json';
    schema?: string;           // For JSON responses
  };
}

// Message rendering component
function ChatMessage({ message, isStreaming }: { message: Message; isStreaming: boolean }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<{
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  } | null>(null);
  const speechRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  const supabase = React.useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // Fetch user profile and avatar
  React.useEffect(() => {
    async function getProfile() {
      if (message.isUser) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(data);
        }
      }
    }
    getProfile();
  }, [message.isUser, supabase]);

  // Download and set avatar URL
  React.useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('Error downloading avatar:', error);
      }
    }

    if (profile?.avatar_url) {
      downloadImage(profile.avatar_url);
    }
  }, [profile?.avatar_url, supabase]);

  // Cleanup avatar URL on unmount
  React.useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleTextToSpeech = () => {
    if (!window.speechSynthesis) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech error",
        description: "An error occurred while speaking.",
        variant: "destructive",
      });
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Cleanup speech on unmount
  React.useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <div className={cn(
      "group relative py-4",
      message.pending && "animate-pulse"
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <ChatBubble
          variant={message.isUser ? "sent" : "received"}
          layout="default"
          className={cn(
            "max-w-[80%]",
            message.isUser ? "ml-auto" : "mr-auto",
            message.error && "border-red-500/50"
          )}
        >
          {!message.isUser && (
            <ChatBubbleAvatar
              src="/images/blog-mnky-avatar.png"
              fallback="BM"
              className={cn(
                "h-8 w-8 ring-2",
                message.error 
                  ? "ring-red-500/20" 
                  : "ring-amber-500/20"
              )}
            />
          )}
          {message.isUser && (
            <ChatBubbleAvatar
              src={avatarUrl || undefined}
              fallback={profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              className={cn(
                "h-8 w-8 ring-2",
                message.error 
                  ? "ring-red-500/20" 
                  : "ring-amber-500/20"
              )}
            />
          )}
          <ChatBubbleMessage 
            isLoading={message.pending}
            isStreaming={isStreaming}
            className={cn(
              "prose prose-zinc dark:prose-invert backdrop-blur-sm",
              message.isUser 
                ? "bg-amber-500/90 text-zinc-900 rounded-2xl rounded-br-sm ml-2" 
                : "bg-zinc-800/70 text-zinc-100 rounded-2xl rounded-bl-sm mr-2",
              message.error && "text-red-500"
            )}
          >
            {message.pending ? (
              <MessageLoading />
            ) : (
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
                        className="border-l-4 border-amber-500/20 pl-4 italic text-zinc-400"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    );
                  },
                  h1: ({ children, ...props }) => (
                    <h1 className="text-2xl font-bold mb-4" {...props}>{children}</h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-xl font-bold mb-3" {...props}>{children}</h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-lg font-bold mb-2" {...props}>{children}</h3>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside mb-4" {...props}>{children}</ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside mb-4" {...props}>{children}</ol>
                  ),
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-zinc-800" {...props}>
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
                {message.content}
              </ReactMarkdown>
            )}
          </ChatBubbleMessage>
        </ChatBubble>
        
        {/* Command Panel */}
        <div className={cn(
          "flex items-center gap-2 mt-2",
          message.isUser ? "justify-end" : "justify-start"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy message</span>
          </Button>
          {!message.isUser && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                isSpeaking && "text-amber-500 bg-zinc-800/50"
              )}
              onClick={handleTextToSpeech}
            >
              {isSpeaking ? (
                <Speaker className="h-4 w-4 animate-pulse" />
              ) : (
                <Speaker className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isSpeaking ? "Stop speaking" : "Read aloud"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Welcome screen component
function WelcomeScreen({ onSubmit }: { onSubmit?: (message: string) => void }) {
  const suggestions = [
    {
      title: "Explore our latest blog posts",
      description: "Get summaries and insights from our newest articles on scent, technology, and personal growth",
    },
    {
      title: "Help me find content about...",
      description: "Discover articles and discussions tailored to your interests across our five main themes",
    },
    {
      title: "Explain MOOD MNKY's philosophy",
      description: "Learn about our approach to authenticity, self-discovery, and digital well-being",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          <span className="text-amber-500">BLOG</span>{" "}
          <span className="text-zinc-400">MNKY</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Your intelligent guide to the MOOD MNKY universe. I can help you explore our blog posts, 
          discover relevant content, summarize articles, and engage in meaningful discussions about 
          fragrance, technology, gaming, philosophy, and personal growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            className="group flex flex-col gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur p-4 text-left hover:bg-zinc-800/50 transition-all hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)]"
            onClick={() => onSubmit?.(suggestion.title)}
          >
            <span className="font-medium text-zinc-200 group-hover:text-amber-500 transition-colors">
              {suggestion.title}
            </span>
            <span className="text-sm text-zinc-400">
              {suggestion.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MoodMnkyBlogManager() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const { toast } = useToast();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const flowiseService = FlowiseService.getInstance();
  const [config] = React.useState<Record<string, unknown>>({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    memoryType: 'chat',
    messageWindow: 10
  });

  // Debug logging for state changes
  React.useEffect(() => {
    console.log('Streaming state changed:', isStreaming);
  }, [isStreaming]);

  React.useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    try {
      console.log('Uploading file:', file.name);
      const response = await flowiseService.uploadFile(file);
      console.log('File uploaded:', response);
      return response.filepath;
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "File Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (content: string, files?: File[]) => {
    try {
      console.log('Starting submission:', content);
      
      // Abort any ongoing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setIsLoading(true);
      setIsStreaming(true);

      // Add user message with current config
      const userMessage = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date().toISOString(),
        config
      } satisfies Message;

      if (files?.length) {
        await Promise.all(files.map(handleFileUpload));
      }

      console.log('Adding user message:', userMessage);
      setMessages(prev => {
        console.log('Previous messages:', prev);
        const newMessages = [...prev, userMessage];
        console.log('New messages after adding user message:', newMessages);
        return newMessages;
      });

      // Add assistant message placeholder
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date().toISOString(),
        pending: true
      } satisfies Message;

      console.log('Adding assistant placeholder with ID:', assistantMessage.id);
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        console.log('Messages after adding placeholder:', newMessages);
        return newMessages;
      });

      // Convert messages to Flowise format
      const convertToFlowiseMessage = (msg: Message): FlowiseMessage => ({
        message: msg.content,
        type: msg.isUser ? 'userMessage' : 'apiMessage'
      });

      const history = messages.map(convertToFlowiseMessage);

      try {
        console.log('Creating streaming prediction with config:', config);
        const prediction = await flowiseService.createPrediction({
          question: content,
          history,
          streaming: true,
          overrideConfig: config
        });

        for await (const chunk of prediction) {
          console.log('Received chunk:', chunk);
          
          switch (chunk.event) {
            case 'start':
              console.log('Stream started');
              break;

            case 'token':
              if (chunk.data) {
                const tokenText = chunk.data;
                if (tokenText) {
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (!lastMessage.pending) {
                      return prev;
                    }
                    return prev.map(msg =>
                      msg.id === lastMessage.id
                        ? { ...msg, content: msg.content + tokenText }
                        : msg
                    );
                  });
                }
              }
              break;

            case 'error':
              const errorMessage = chunk.data || 'Unknown error';
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, pending: false, error: true, content: errorMessage }
                    : msg
                )
              );
              throw new Error(errorMessage);

            case 'end':
              console.log('Stream ended');
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, pending: false }
                    : msg
                )
              );
              break;

            case 'metadata':
            case 'sourceDocuments':
            case 'usedTools':
              console.log(`Received ${chunk.event}:`, chunk.data);
              break;

            default:
              console.log(`Unhandled event type: ${chunk.event}`, chunk);
          }
        }
      } catch (error) {
        console.error('Prediction error:', error);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, pending: false, error: true, content: error instanceof Error ? error.message : 'Failed to get response' }
              : msg
          )
        );
        toast({
          title: "Chat Error",
          description: error instanceof Error ? error.message : "Failed to get response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      console.log('Request completed, cleaning up...');
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    const currentAbortController = abortControllerRef.current;
    return () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
    };
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[calc(100vh-6rem)] relative flex flex-col pt-2">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          styles.flameHead,
          "w-full h-full max-w-[1200px] mx-auto"
        )} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 relative z-10">
        {hasMessages ? (
          <ChatMessageList>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isStreaming={isStreaming && message.id === messages[messages.length - 1].id} 
              />
            ))}
          </ChatMessageList>
        ) : (
          <div className="h-full flex items-center justify-center">
            <WelcomeScreen onSubmit={handleSubmit} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 pt-4 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}