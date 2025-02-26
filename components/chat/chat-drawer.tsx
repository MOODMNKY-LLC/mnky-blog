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
import { StarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ChatLayout } from "./chat-layout";
import MoodMnkyBlogManager from "../MoodMnkyBlogManager";
import Image from "next/image";

interface ChatDrawerProps {
  className?: string;
}

export function ChatDrawer({ className }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-full w-full rounded-full relative",
            className
          )}
        >
          <Image
            src="/logo.png"
            alt="Open Chat"
            width={32}
            height={32}
            className="object-contain text-amber-500 relative z-10 transition-transform duration-300 group-hover:scale-110 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(49%)_saturate(1000%)_hue-rotate(332deg)_brightness(101%)_contrast(101%)]"
          />
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