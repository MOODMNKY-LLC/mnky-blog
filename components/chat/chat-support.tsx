'use client';

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/chat/expandable-chat";
import Image from "next/image";
import { useState, FormEvent, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { type ChatConfig } from "@/components/chat/chat-config-sheet";

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
  
  // Stream Control
  streamChunkSize?: number;     // Size of streaming chunks
  maxStreamingTime?: number;    // Max time for streaming response
  
  // Rate Limiting
  requestsPerMinute?: number;   // Rate limit for requests
  cooldownPeriod?: number;      // Time between requests
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  config?: FlowiseConfig;  // Add config to Message interface
}

interface FlowiseMessage {
  message: string;
  type: 'user' | 'assistant';
}

export function ChatSupport() {
  const [message, setMessage] = useState('');
  const [config, setConfig] = useState<ChatConfig>({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    memoryType: 'chat',
    messageWindow: 10,
    systemPrompt: "You are BLOG MNKY, a helpful AI assistant..."
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm BLOG MNKY, your personal blog assistant. How can I help you today?",
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup effect for aborting ongoing streams
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleNewChat = () => {
    // Abort any ongoing stream
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setIsLoading(false);
    
    setMessages([{
      id: '1',
      content: "Hi! I'm BLOG MNKY, your personal blog assistant. How can I help you today?",
      isUser: false
    }]);
  };

  const handleConfigUpdate = (newConfig: ChatConfig) => {
    console.log('Updating chat configuration:', newConfig);
    setConfig(newConfig);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading || isStreaming) return;
    
    console.log('Starting new chat submission');
    
    // Abort any ongoing stream
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    // Add user message with current config
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      config  // Attach current config to message
    };
    
    console.log('Adding user message:', userMessage);
    setMessages(prev => {
      console.log('Previous messages:', prev);
      const newMessages = [...prev, userMessage];
      console.log('New messages after adding user message:', newMessages);
      return newMessages;
    });
    
    setMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Convert messages to Flowise format with config
      const history: FlowiseMessage[] = messages.map(msg => ({
        message: msg.content,
        type: msg.isUser ? 'user' : 'assistant'
      }));

      // Add assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString();
      console.log('Adding assistant placeholder with ID:', assistantMessageId);
      
      setMessages(prev => {
        const newMessages = [...prev, {
          id: assistantMessageId,
          content: '',
          isUser: false
        }];
        console.log('Messages after adding placeholder:', newMessages);
        return newMessages;
      });

      // Create prediction with streaming and current config
      console.log('Sending request to Flowise API with config:', config);
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLOWISE_HOST_URL}/api/v1/prediction/${process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FLOWISE_API_KEY}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          question: userMessage.content,
          history,
          streaming: true,
          overrideConfig: config  // Use current config
        }),
        signal: abortControllerRef.current.signal
      });

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('Stream completed');
            break;
          }

          // Append new data to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          let currentEvent = '';
          let currentData = '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
              // Empty line indicates end of message
              if (currentEvent || currentData) {
                console.log('Raw SSE message:', { event: currentEvent, data: currentData });
                
                try {
                  const parsedData = currentData ? JSON.parse(currentData) : null;
                  console.log('Parsed SSE data:', parsedData);
                  
                  // Determine the actual event type and data
                  const eventType = currentEvent || parsedData?.event;
                  const eventData = parsedData?.data || parsedData;
                  
                  console.log('Processing event:', { type: eventType, data: eventData });

                  switch (eventType) {
                    case 'start':
                      console.log('Stream started');
                      break;

                    case 'token':
                      if (eventData) {
                        // Extract the actual text content from the token
                        const tokenText = typeof eventData === 'string' ? eventData : eventData.text || eventData.content || '';
                        if (tokenText) {
                          setMessages(prev => {
                            const lastMessage = prev[prev.length - 1];
                            if (!lastMessage.isUser) {
                              return prev.map(msg =>
                                msg.id === lastMessage.id
                                  ? { ...msg, content: lastMessage.content + tokenText }
                                  : msg
                              );
                            }
                            return prev;
                          });
                        }
                      }
                      break;

                    case 'error':
                      console.error('Stream error:', eventData);
                      throw new Error(typeof eventData === 'string' ? eventData : 'Stream error');

                    case 'metadata':
                      console.log('Received metadata:', eventData);
                      break;

                    case 'sourceDocuments':
                      console.log('Received source documents:', eventData);
                      break;

                    case 'usedTools':
                      console.log('Used tools:', eventData);
                      break;

                    case 'end':
                      console.log('Stream ended');
                      return;

                    default:
                      console.log('Unhandled event type:', eventType);
                  }
                } catch (e) {
                  console.error('Error processing SSE data:', e, { currentEvent, currentData });
                }
                
                // Reset for next message
                currentEvent = '';
                currentData = '';
              }
            } else if (trimmedLine.startsWith('event:')) {
              currentEvent = trimmedLine.slice(6).trim();
            } else if (trimmedLine.startsWith('data:')) {
              currentData = trimmedLine.slice(5).trim();
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: unknown) {
      console.error('Error in chat submission:', error);
      if ((error as Error).name !== 'AbortError') {
        setMessages(prev => {
          const errorMessage = {
            id: (Date.now() + 1).toString(),
            content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
            isUser: false
          };
          console.log('Adding error message:', errorMessage);
          return [...prev, errorMessage];
        });
      }
    } finally {
      console.log('Chat submission completed');
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <ExpandableChat size="lg" position="bottom-right">
      <ExpandableChatHeader className="flex-col text-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/flame_head_icon.svg"
            alt="MOOD MNKY Logo"
            width={24}
            height={28}
            style={{ height: 'auto' }}
            className="relative z-10 text-amber-500 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
          />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Chat with BLOG MNKY ✨
          </h1>
        </div>
        <p className="text-muted-foreground">Ask any question about our blog or content</p>
        <div className="flex gap-2 items-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
            onClick={handleNewChat}
          >
            New Chat
          </Button>
          <Button variant="outline" size="sm" className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10">
            See FAQ
          </Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody className="bg-zinc-900/50 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
              {!msg.isUser && (
                <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/flame_head_icon.svg"
                    alt="MOOD MNKY Logo"
                    width={20}
                    height={24}
                    style={{ height: 'auto' }}
                    className="relative z-10 text-amber-500 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
                  />
                </div>
              )}
              <div className={cn(
                "rounded-lg p-3 text-sm prose-sm prose-invert max-w-none prose-pre:bg-zinc-800/50 prose-pre:border prose-pre:border-zinc-800",
                msg.isUser ? "bg-amber-500/10 text-amber-100" : "bg-zinc-800/50 text-zinc-100"
              )}>
                {msg.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-zinc-800/50 rounded p-4 overflow-x-auto border border-zinc-800">
                          {children}
                        </pre>
                      ),
                      code: ({ children }) => (
                        <code className="bg-zinc-800/50 rounded px-1.5 py-0.5 text-sm text-amber-500">
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1 last:mb-0">{children}</li>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-lg font-semibold mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-semibold mb-2">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold mb-2">{children}</h3>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-amber-500/20 pl-4 italic mb-2">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <div className="w-5 h-5 relative">
                    <span className="absolute w-2 h-2 bg-amber-500 rounded-full animate-typing-dot" style={{ left: '0%' }} />
                    <span className="absolute w-2 h-2 bg-amber-500 rounded-full animate-typing-dot" style={{ left: '33%', animationDelay: '0.2s' }} />
                    <span className="absolute w-2 h-2 bg-amber-500 rounded-full animate-typing-dot" style={{ left: '66%', animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>
              {msg.isUser && (
                <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="size-4 rounded-full bg-amber-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && !isStreaming && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/flame_head_icon.svg"
                  alt="MOOD MNKY Logo"
                  width={20}
                  height={24}
                  style={{ height: 'auto' }}
                  className="relative z-10 text-amber-500 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)] animate-pulse"
                />
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 text-sm text-zinc-100 animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ExpandableChatBody>
      <ExpandableChatFooter className="border-t border-zinc-800 bg-zinc-900/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-2">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              disabled={isLoading || isStreaming}
            />
          </div>
          <Button 
            type="submit" 
            size="icon"
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
            disabled={!message.trim() || isLoading || isStreaming}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
} 