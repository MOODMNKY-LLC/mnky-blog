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
  Image as ImageIcon, Headphones,
  MessageSquare, MessagesSquare, BookOpen,
  Users, PenSquare, Hash, Smile
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type FeatureSection } from "@/lib/contexts/feature-navigation";

interface ChatInputProps {
  section: FeatureSection;
  onSubmit?: (message: string) => void;
  isLoading?: boolean;
}

// Define the section configuration type
type SectionConfig = {
  placeholder: string;
  showVoice: boolean;
  showCall: boolean;
  showImage: boolean;
  showWeb: boolean;
  showUpload: boolean;
  showEmoji: boolean;
  icon: React.ReactNode;
  submitLabel: string;
};

type SectionConfigs = {
  [K in Exclude<FeatureSection, 'home'>]: SectionConfig;
};

export function ChatInput({
  section,
  onSubmit,
  isLoading = false,
}: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Section-specific configurations
  const sectionConfig: SectionConfigs = {
    chat: {
      placeholder: "Share your thoughts with the community...",
      showVoice: true,
      showCall: true,
      showImage: true,
      showWeb: true,
      showUpload: true,
      showEmoji: true,
      icon: <MessageSquare className="h-4 w-4" />,
      submitLabel: "Send message",
    },
    forum: {
      placeholder: "Start a new topic for discussion...",
      showVoice: false,
      showCall: false,
      showImage: true,
      showWeb: true,
      showUpload: true,
      showEmoji: true,
      icon: <MessagesSquare className="h-4 w-4" />,
      submitLabel: "Post discussion",
    },
    discussions: {
      placeholder: "Join the conversation and share your perspective...",
      showVoice: false,
      showCall: false,
      showImage: true,
      showWeb: true,
      showUpload: true,
      showEmoji: true,
      icon: <BookOpen className="h-4 w-4" />,
      submitLabel: "Add comment",
    },
    blog: {
      placeholder: "Share your thoughts on this blog post...",
      showVoice: false,
      showCall: false,
      showImage: true,
      showWeb: false,
      showUpload: true,
      showEmoji: true,
      icon: <PenSquare className="h-4 w-4" />,
      submitLabel: "Post comment",
    },
    members: {
      placeholder: "Send a private message to this member...",
      showVoice: true,
      showCall: true,
      showImage: true,
      showWeb: false,
      showUpload: true,
      showEmoji: true,
      icon: <Users className="h-4 w-4" />,
      submitLabel: "Send message",
    },
    events: {
      placeholder: "Share your thoughts about this event...",
      showVoice: false,
      showCall: true,
      showImage: true,
      showWeb: false,
      showUpload: true,
      showEmoji: true,
      icon: <MessageSquare className="h-4 w-4" />,
      submitLabel: "Post comment",
    },
  };

  const config = section === 'home' ? null : sectionConfig[section];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit?.(input);
    setInput("");
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

  if (!config) return null;

  return (
    <form 
      ref={formRef} 
      onSubmit={handleSubmit} 
      className="relative flex flex-col w-full"
    >
      <div className="relative flex w-full items-center rounded-xl border border-zinc-800/50 bg-zinc-900/80 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-shadow duration-300 focus-within:border-amber-500/30 focus-within:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
        <div className="absolute left-2 bottom-2 flex items-center gap-1">
          {config.showUpload && (
            <>
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
                      className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
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
            </>
          )}

          {config.showWeb && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
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
          )}

          {config.showImage && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
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
          )}

          {config.showEmoji && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
                  >
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                  <p>Add emoji</p>
                  <p className="text-xs text-zinc-400">Express yourself with emojis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={config.placeholder}
          className={cn(
            "min-h-[52px] w-full resize-none bg-transparent px-4 py-[1.1rem]",
            "focus-within:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "rounded-xl pl-28 pr-20 text-sm text-zinc-100 placeholder:text-zinc-400",
            "scrollbar-none transition-opacity duration-200",
            "text-center placeholder:text-center",
            isLoading && "opacity-50"
          )}
          disabled={isLoading}
          rows={1}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {config.showVoice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
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
          )}

          {config.showCall && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50 transition-colors duration-200"
                  >
                    <Headphones className="h-4 w-4" />
                    <span className="sr-only">Start call</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                  <p>Start real-time call</p>
                  <p className="text-xs text-zinc-400">Start a voice or video call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "h-7 w-7 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-zinc-900",
                    "transition-all duration-200 hover:scale-105",
                    "shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]",
                    (!input.trim() || isLoading) && "opacity-50"
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                  <span className="sr-only">{config.submitLabel}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900/90 backdrop-blur-sm text-zinc-100 border-zinc-800/50">
                <p>{config.submitLabel}</p>
                <p className="text-xs text-zinc-400">Send your message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  );
} 