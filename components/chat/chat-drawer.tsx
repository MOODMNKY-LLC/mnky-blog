'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatLayout } from "./chat-layout";
import MoodMnkyBlogManager from "../MoodMnkyBlogManager";

interface ChatDrawerProps {
  className?: string;
}

export function ChatDrawer({ className }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed bottom-4 right-4 h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 border-2 border-amber-500/20 shadow-lg hover:shadow-amber-500/10",
            "dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-500",
            className
          )}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[calc(100vh-2rem)]">
        <DrawerHeader className="border-b border-zinc-800">
          <DrawerTitle className="text-center">
            <span className="text-amber-500">BLOG</span>{" "}
            <span className="text-zinc-400">MNKY</span>
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <ChatLayout>
            <MoodMnkyBlogManager />
          </ChatLayout>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 