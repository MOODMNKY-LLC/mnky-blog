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
import { FlowiseAPI, type ChatMessage } from "@/utils/flowise";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export function ChatSupport() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm BLOG MNKY, your personal blog assistant. How can I help you today?",
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      content: "Hi! I'm BLOG MNKY, your personal blog assistant. How can I help you today?",
      isUser: false
    }]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Convert messages to Flowise format
      const flowiseMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // Add current message
      flowiseMessages.push({
        role: 'user',
        content: userMessage.content
      });

      // Get response from Flowise
      const response = await FlowiseAPI.sendChatMessage(flowiseMessages);

      // Add assistant response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false
      }]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
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
                    className="relative z-10 text-amber-500 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
                  />
                </div>
              )}
              <div className={cn(
                "rounded-lg p-3 text-sm",
                msg.isUser ? "bg-amber-500/10 text-amber-100" : "bg-zinc-800/50 text-zinc-100"
              )}>
                {msg.content}
              </div>
              {msg.isUser && (
                <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="size-4 rounded-full bg-amber-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/flame_head_icon.svg"
                  alt="MOOD MNKY Logo"
                  width={20}
                  height={24}
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
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            size="icon"
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
            disabled={!message.trim() || isLoading}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
} 