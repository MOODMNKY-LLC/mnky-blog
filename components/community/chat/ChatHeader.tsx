'use client';

import { Hash, Search, Bell, Inbox, Pin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

interface ChatHeaderProps {
  channelName?: string;
  channelDescription?: string;
  isPinned: boolean;
  onPinnedClick: () => void;
  onSearch?: (query: string) => void;
}

function SearchBar({ 
  onSearch 
}: { 
  onSearch?: (query: string) => void 
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    // Focus the input after expansion
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery('');
    onSearch?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCollapse();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch?.(newQuery);
  };

  if (!isExpanded) {
    return (
      <ChatFunctionButton
        icon={Search}
        label="Search Messages"
        shortcut="⌘K"
        onClick={handleExpand}
      />
    );
  }

  return (
    <div className={cn(
      "relative flex items-center gap-2",
      "min-w-[300px]",
      "animate-in fade-in slide-in-from-right-8 duration-300"
    )}>
      <div className={cn(
        "relative flex items-center w-full",
        "rounded-full",
        "bg-zinc-900/50",
        "backdrop-blur-sm",
        "border border-zinc-800/50",
        "focus-within:border-amber-500/50 focus-within:shadow-[0_0_12px_0_rgba(245,158,11,0.2)]",
        "transition-all duration-300"
      )}>
        <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search messages..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-9 pr-8 h-10",
            "bg-transparent",
            "border-0",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-zinc-400",
            "text-zinc-100"
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-8 w-8 rounded-full hover:bg-zinc-800/80"
            onClick={handleCollapse}
          >
            <X className="h-4 w-4 text-zinc-400" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ChatFunctionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive,
  shortcut
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
  isActive?: boolean;
  shortcut?: string;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
              "relative w-10 h-10 rounded-full",
              "bg-zinc-900/50 dark:bg-zinc-900/50",
              "backdrop-blur-sm",
              "border border-zinc-800/50",
              "hover:bg-zinc-800/50",
              "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
              "transition-all duration-300 ease-in-out",
              "group",
              isActive && "bg-zinc-800/50 border-amber-500/50 shadow-[0_0_12px_0_rgba(245,158,11,0.5)]"
            )}
          >
            <div className={cn(
              "text-zinc-400 group-hover:text-amber-500 transition-colors",
              isActive && "text-amber-500"
            )}>
              <Icon className="h-5 w-5" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          sideOffset={8}
          className="bg-zinc-900/90 border-zinc-800/50 backdrop-blur-sm px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-100">
              {label}
            </span>
            {shortcut && (
              <kbd className="min-w-[18px] h-[18px] px-1.5 text-[10px] font-mono rounded-md bg-zinc-800/80 text-zinc-400">
                {shortcut}
              </kbd>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ChatHeader({ 
  channelName = 'general',
  channelDescription = 'Welcome to the general chat channel',
  isPinned,
  onPinnedClick,
  onSearch,
}: ChatHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 h-14",
      "transition-all duration-300 ease-in-out",
      "w-full"
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          "flex items-center justify-center",
          "w-10 h-10 rounded-full",
          "bg-zinc-800/50",
          "text-amber-500/80",
          "transition-all duration-300 ease-in-out"
        )}>
          <Hash className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="font-semibold text-zinc-100 truncate">{channelName}</h2>
          <p className="text-sm text-zinc-400 truncate hidden sm:block">{channelDescription}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <SearchBar onSearch={onSearch} />
        <ChatFunctionButton
          icon={Bell}
          label="Notifications"
          shortcut="⌘N"
        />
        <ChatFunctionButton
          icon={Inbox}
          label="Inbox"
          shortcut="⌘I"
        />
        <ChatFunctionButton
          icon={Pin}
          label="Pinned Messages"
          isActive={isPinned}
          onClick={onPinnedClick}
          shortcut="⌘P"
        />
      </div>
    </div>
  );
} 