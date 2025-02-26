'use client';

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EventsSidebarSkeletonProps {
  isCollapsed?: boolean;
}

export function EventsSidebarSkeleton({ isCollapsed }: EventsSidebarSkeletonProps) {
  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300",
      isCollapsed ? "w-[72px]" : "w-[280px]"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center h-12 border-b border-zinc-800/50",
        isCollapsed ? "justify-center px-1" : "px-3"
      )}>
        {!isCollapsed && <Skeleton className="h-4 w-24" />}
        {isCollapsed && <Skeleton className="h-4 w-4" />}
      </div>

      {/* Categories */}
      <div className={cn(
        "pt-4",
        isCollapsed ? "px-1 space-y-2" : "px-2 space-y-1"
      )}>
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className={cn(
              "rounded-md",
              isCollapsed ? "h-10 w-10" : "h-8 w-full"
            )} />
          </div>
        ))}
      </div>

      {/* Channels */}
      <div className="mt-6">
        {!isCollapsed && (
          <div className="px-3 mb-2">
            <Skeleton className="h-3 w-20" />
          </div>
        )}
        <div className={cn(
          isCollapsed ? "px-1 space-y-2" : "px-2 space-y-[2px]"
        )}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className={cn(
                "rounded-md",
                isCollapsed ? "h-10 w-10" : "h-8 w-full"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className={cn(
        "mt-auto",
        isCollapsed ? "p-1" : "p-2"
      )}>
        <Skeleton className={cn(
          "rounded-md",
          isCollapsed ? "h-10 w-10" : "h-8 w-full"
        )} />
      </div>
    </div>
  );
} 