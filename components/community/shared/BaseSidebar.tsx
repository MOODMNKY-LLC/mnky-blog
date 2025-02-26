import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
  badge?: {
    type: 'new' | 'live' | 'updated';
    text?: string;
  };
}

export interface SidebarSection {
  id: string;
  name: string;
  items: SidebarItem[];
}

export interface BaseSidebarProps {
  isCollapsed?: boolean;
  sections: SidebarSection[];
  selectedItemId?: string;
  onItemSelect?: (itemId: string) => void;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function BaseSidebar({
  isCollapsed,
  sections,
  selectedItemId,
  onItemSelect,
  headerContent,
  footerContent,
}: BaseSidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "flex flex-col h-full transition-all duration-300",
        isCollapsed ? "w-0" : "w-[280px]"
      )}>
        {/* Header */}
        {headerContent && (
          <div className={cn(
            "flex items-center h-14 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-800/50 to-transparent",
            isCollapsed ? "justify-center px-1" : "px-4"
          )}>
            {headerContent}
          </div>
        )}

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                {!isCollapsed && (
                  <h4 className="px-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    {section.name}
                  </h4>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full relative group",
                            selectedItemId === item.id && "bg-zinc-800/50",
                            isCollapsed ? "justify-center h-10 p-0" : "justify-start px-2",
                            "rounded-lg transition-all duration-300",
                            // Enhanced hover and active states
                            "hover:bg-zinc-800/50",
                            "border border-transparent",
                            "hover:border-amber-500/50 hover:shadow-[0_0_12px_0_rgba(245,158,11,0.5)]",
                            selectedItemId === item.id && "border-amber-500/50 shadow-[0_0_12px_0_rgba(245,158,11,0.5)]"
                          )}
                          onClick={() => onItemSelect?.(item.id)}
                        >
                          <div className={cn(
                            "flex items-center gap-2",
                            "text-zinc-400 group-hover:text-amber-500 transition-colors",
                            selectedItemId === item.id && "text-amber-500"
                          )}>
                            {item.icon}
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 truncate">{item.name}</span>
                                {item.count && (
                                  <span className="ml-auto text-xs">
                                    {item.count}
                                  </span>
                                )}
                                {item.badge && (
                                  <span className={cn(
                                    "ml-auto text-xs px-1.5 py-0.5 rounded-full",
                                    item.badge.type === 'live' && "bg-emerald-500/20 text-emerald-500",
                                    item.badge.type === 'new' && "bg-amber-500/20 text-amber-500",
                                    item.badge.type === 'updated' && "bg-blue-500/20 text-blue-500"
                                  )}>
                                    {item.badge.text || item.badge.type}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" sideOffset={10}>
                          <div className="flex items-center gap-2">
                            {item.name}
                            {item.count && (
                              <span className="text-xs text-zinc-400">
                                {item.count}
                              </span>
                            )}
                            {item.badge && (
                              <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full",
                                item.badge.type === 'live' && "bg-emerald-500/20 text-emerald-500",
                                item.badge.type === 'new' && "bg-amber-500/20 text-amber-500",
                                item.badge.type === 'updated' && "bg-blue-500/20 text-blue-500"
                              )}>
                                {item.badge.text || item.badge.type}
                              </span>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {footerContent && (
          <div className={cn(
            "mt-auto border-t border-zinc-800/50 bg-gradient-to-t from-zinc-800/50 to-transparent",
            isCollapsed ? "p-1" : "p-2"
          )}>
            {footerContent}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 