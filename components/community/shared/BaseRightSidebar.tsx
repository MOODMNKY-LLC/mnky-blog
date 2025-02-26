import * as React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface RightSidebarProps {
  isCollapsed?: boolean;
  headerContent?: React.ReactNode;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function BaseRightSidebar({
  isCollapsed,
  headerContent,
  children,
  footerContent,
}: RightSidebarProps) {
  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300",
      isCollapsed ? "w-0" : "w-[280px]"
    )}>
      {/* Header */}
      {headerContent && (
        <div className={cn(
          "flex items-center h-14 border-b border-zinc-800/50",
          "bg-gradient-to-b from-zinc-800/50 to-transparent",
          "backdrop-blur-sm",
          isCollapsed ? "justify-center" : "px-4"
        )}>
          {headerContent}
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className={cn(
          "p-4",
          "hover:shadow-[inset_0_0_12px_0_rgba(245,158,11,0.1)]",
          "transition-all duration-300"
        )}>
          {children}
        </div>
      </ScrollArea>

      {/* Footer */}
      {footerContent && (
        <div className={cn(
          "mt-auto border-t border-zinc-800/50",
          "bg-gradient-to-t from-zinc-800/50 to-transparent",
          "backdrop-blur-sm",
          isCollapsed ? "p-1" : "p-2"
        )}>
          {footerContent}
        </div>
      )}
    </div>
  );
} 