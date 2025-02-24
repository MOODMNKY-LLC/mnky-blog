import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  SendHorizontal, Mic, Plus, Globe, 
  Image as ImageIcon, Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSubmit,
  isLoading = false,
}: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSubmit?.(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // Auto-resize textarea based on content
  React.useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "60px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  return (
    <form 
      ref={formRef} 
      onSubmit={handleSubmit} 
      className="relative flex flex-col w-full"
    >
      <div className="relative flex w-full items-center rounded-xl border border-zinc-800/50 bg-zinc-900/70 backdrop-blur-sm focus-within:border-amber-500/20 shadow-[0_0_8px_0_rgba(0,0,0,0.1)]">
        <div className="absolute left-2 bottom-2 flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              // Handle file upload
              console.log(e.target.files);
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Upload file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Upload a file</p>
                <p className="text-xs text-zinc-400">Share documents, images, or code files</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Web search</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Web search</p>
                <p className="text-xs text-zinc-400">Search the web for information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Generate image</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Generate image</p>
                <p className="text-xs text-zinc-400">Create AI-generated images</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message BLOG MNKY..."
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem]",
            "focus-within:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "rounded-xl pl-32 pr-24 text-base text-zinc-100 placeholder:text-zinc-400",
            "scrollbar-none",
            isLoading && "opacity-50"
          )}
          disabled={isLoading}
          rows={1}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Voice input</p>
                <p className="text-xs text-zinc-400">Use your voice to send a message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                >
                  <Headphones className="h-4 w-4" />
                  <span className="sr-only">Start call</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Start real-time call</p>
                <p className="text-xs text-zinc-400">Talk to BLOG MNKY in real-time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "h-8 w-8 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-zinc-900",
                    "transition-colors duration-200",
                    (!input.trim() || isLoading) && "opacity-50"
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>Send message</p>
                <p className="text-xs text-zinc-400">Send your message to BLOG MNKY</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  );
}
