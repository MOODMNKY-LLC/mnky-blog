'use client';

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, ref) => {
    const {
      scrollRef,
      isAtBottom,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth,
      content: children,
    });

    // Merge refs
    React.useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "flex flex-col w-full h-full overflow-y-auto px-2 py-4",
            className
          )}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col gap-4">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-7 w-7 rounded-full shadow-md border-amber-500/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-amber-500/40"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-3 w-3 text-amber-500" />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
