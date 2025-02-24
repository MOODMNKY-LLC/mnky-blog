import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Plus, MessageSquare, Search, Image as ImageIcon, 
  Code, Bot, Sparkles, BookOpen,
  FileText, History, Youtube, Database, Newspaper, HelpCircle, ChevronDown, Headphones, Users, Calendar
} from "lucide-react";
import { ChatMessageList } from "./chat-message-list";
import { UserProfile } from "./user-profile";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatLayoutProps {
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (message: string) => void;
  hasMessages?: boolean;
}

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  type: "channel" | "direct" | "history";
  participants?: string[];
  lastMessage?: string;
}

const suggestions = [
  {
    title: "Tell me about scent and memory",
    description: "Explore the psychology of fragrance and its influence on mood and perception",
  },
  {
    title: "Explain digital identity",
    description: "How technology shapes self-expression and authenticity in the modern world",
  },
  {
    title: "Discuss mindfulness practices",
    description: "Exploring the intersection of scent, sound, and self-reflection",
  },
];

export function ChatLayout({
  className,
  children,
  onSubmit,
  hasMessages = false,
}: ChatLayoutProps) {
  const [chats, setChats] = React.useState<Chat[]>([
    { 
      id: "1", 
      title: "Understanding Scent & Memory", 
      timestamp: "2h ago",
      type: "channel",
      participants: ["user1", "user2"],
      lastMessage: "This is a sample message"
    },
    { 
      id: "2", 
      title: "Digital Identity Discussion", 
      timestamp: "1d ago",
      type: "direct",
      participants: ["user1", "user3"],
      lastMessage: "This is another sample message"
    },
    { 
      id: "3", 
      title: "Philosophy of Gaming", 
      timestamp: "3d ago",
      type: "history",
      participants: ["user1", "user4"],
      lastMessage: "This is a third sample message"
    },
  ]);
  
  const [selectedChat, setSelectedChat] = React.useState<string>("1");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = React.useState(true);
  const [isBlogPostsOpen, setIsBlogPostsOpen] = React.useState(true);
  const [isMediaContentOpen, setIsMediaContentOpen] = React.useState(true);
  const [isCommunityOpen, setIsCommunityOpen] = React.useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = React.useState(true);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: "Just now",
      type: "channel",
      participants: ["user1"],
      lastMessage: "This is a new chat"
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className={cn("relative h-full", className)}>
        {/* Sidebar Container - Now Absolute */}
        <div className="absolute left-0 top-0 h-full z-10">
          <Sidebar className="border-r border-zinc-800/20 bg-zinc-900/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.1)]">
            <SidebarHeader className="border-b border-zinc-800/20 px-4 py-3 bg-gradient-to-b from-zinc-900/30 to-transparent">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "flex flex-col gap-1",
                  !sidebarOpen && "opacity-0"
                )}>
                  <div className="font-semibold">
                    <span className="text-amber-500">BLOG</span>{" "}
                    <span className="text-zinc-400">MNKY</span>
                  </div>
                  <span className="text-xs text-zinc-400">Explore • Reflect • Connect</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Chat</span>
                </Button>
              </div>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto h-[calc(100vh-8rem)] scrollbar-none">
              <div className="space-y-4 px-2">
                {/* Recent Chats */}
                <Collapsible
                  open={isRecentChatsOpen}
                  onOpenChange={setIsRecentChatsOpen}
                  className="space-y-2"
                >
                  <SidebarGroup>
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent cursor-pointer hover:from-amber-500/20 hover:via-amber-500/10 hover:to-transparent transition-all group">
                        <History className="mr-2 h-3 w-3 inline text-amber-500" />
                        {sidebarOpen && (
                          <>
                            <span className="text-amber-500/80">RECENT CHATS</span>
                            <ChevronDown className={cn(
                              "h-3 w-3 inline ml-auto transition-transform text-amber-500/80",
                              isRecentChatsOpen && "transform rotate-180"
                            )} />
                          </>
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {chats.map((chat) => (
                            <SidebarMenuItem key={chat.id}>
                              <Button
                                variant={selectedChat === chat.id ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full justify-start gap-2 h-auto py-3 text-zinc-400 hover:text-amber-500",
                                  selectedChat === chat.id && "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
                                  !sidebarOpen && "justify-center px-0"
                                )}
                                onClick={() => setSelectedChat(chat.id)}
                              >
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                {sidebarOpen && (
                                  <div className="flex-1 truncate text-left">
                                    <div className="truncate">{chat.title}</div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                      <span>{chat.timestamp}</span>
                                      {chat.lastMessage && (
                                        <>
                                          <span>•</span>
                                          <span className="truncate">{chat.lastMessage}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Button>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>

                <Separator className="bg-zinc-800/20 backdrop-blur-sm" />

                {/* Blog Posts */}
                <Collapsible
                  open={isBlogPostsOpen}
                  onOpenChange={setIsBlogPostsOpen}
                  className="space-y-2"
                >
                  <SidebarGroup>
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent cursor-pointer hover:from-amber-500/20 hover:via-amber-500/10 hover:to-transparent transition-all group">
                        <FileText className="mr-2 h-3 w-3 inline text-amber-500" />
                        {sidebarOpen && (
                          <>
                            <span className="text-amber-500/80">BLOG POSTS</span>
                            <ChevronDown className={cn(
                              "h-3 w-3 inline ml-auto transition-transform text-amber-500/80",
                              isBlogPostsOpen && "transform rotate-180"
                            )} />
                          </>
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Sparkles className="h-4 w-4" />
                              {sidebarOpen && <span>Featured Posts</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <BookOpen className="h-4 w-4" />
                              {sidebarOpen && <span>Latest Posts</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Bot className="h-4 w-4" />
                              {sidebarOpen && <span>Saved Posts</span>}
                            </Button>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>

                <Separator className="bg-zinc-800/20 backdrop-blur-sm" />

                {/* Media Content */}
                <Collapsible
                  open={isMediaContentOpen}
                  onOpenChange={setIsMediaContentOpen}
                  className="space-y-2"
                >
                  <SidebarGroup>
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent cursor-pointer hover:from-amber-500/20 hover:via-amber-500/10 hover:to-transparent transition-all group">
                        <Youtube className="mr-2 h-3 w-3 inline text-amber-500" />
                        {sidebarOpen && (
                          <>
                            <span className="text-amber-500/80">MEDIA CONTENT</span>
                            <ChevronDown className={cn(
                              "h-3 w-3 inline ml-auto transition-transform text-amber-500/80",
                              isMediaContentOpen && "transform rotate-180"
                            )} />
                          </>
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Youtube className="h-4 w-4" />
                              {sidebarOpen && <span>Video Library</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <ImageIcon className="h-4 w-4" />
                              {sidebarOpen && <span>Image Gallery</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Headphones className="h-4 w-4" />
                              {sidebarOpen && <span>Audio Content</span>}
                            </Button>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>

                <Separator className="bg-zinc-800/20 backdrop-blur-sm" />

                {/* Community */}
                <Collapsible
                  open={isCommunityOpen}
                  onOpenChange={setIsCommunityOpen}
                  className="space-y-2"
                >
                  <SidebarGroup>
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent cursor-pointer hover:from-amber-500/20 hover:via-amber-500/10 hover:to-transparent transition-all group">
                        <Users className="mr-2 h-3 w-3 inline text-amber-500" />
                        {sidebarOpen && (
                          <>
                            <span className="text-amber-500/80">COMMUNITY</span>
                            <ChevronDown className={cn(
                              "h-3 w-3 inline ml-auto transition-transform text-amber-500/80",
                              isCommunityOpen && "transform rotate-180"
                            )} />
                          </>
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <MessageSquare className="h-4 w-4" />
                              {sidebarOpen && <span>Discussion Forums</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Users className="h-4 w-4" />
                              {sidebarOpen && <span>Study Groups</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Calendar className="h-4 w-4" />
                              {sidebarOpen && <span>Events</span>}
                            </Button>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>

                <Separator className="bg-zinc-800/20 backdrop-blur-sm" />

                {/* Resources */}
                <Collapsible
                  open={isResourcesOpen}
                  onOpenChange={setIsResourcesOpen}
                  className="space-y-2"
                >
                  <SidebarGroup>
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel className="px-2 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent cursor-pointer hover:from-amber-500/20 hover:via-amber-500/10 hover:to-transparent transition-all group">
                        <Database className="mr-2 h-3 w-3 inline text-amber-500" />
                        {sidebarOpen && (
                          <>
                            <span className="text-amber-500/80">RESOURCES</span>
                            <ChevronDown className={cn(
                              "h-3 w-3 inline ml-auto transition-transform text-amber-500/80",
                              isResourcesOpen && "transform rotate-180"
                            )} />
                          </>
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <BookOpen className="h-4 w-4" />
                              {sidebarOpen && <span>Documentation</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <HelpCircle className="h-4 w-4" />
                              {sidebarOpen && <span>FAQs</span>}
                            </Button>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
                                !sidebarOpen && "justify-center px-0"
                              )}
                            >
                              <Newspaper className="h-4 w-4" />
                              {sidebarOpen && <span>Guides & Tutorials</span>}
                            </Button>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-zinc-800/20 p-4 bg-gradient-to-t from-zinc-900/30 to-transparent">
              <UserProfile sidebarOpen={sidebarOpen} />
            </SidebarFooter>
          </Sidebar>
          <SidebarTrigger />
        </div>

        {/* Main Chat Area - Fixed Position */}
        <div className={cn(
          "h-full transition-[margin] duration-300 relative z-0",
          sidebarOpen ? "ml-[280px]" : "ml-0"
        )}>
          {/* Background Container */}
          {React.Children.toArray(children)[0]}
          
          <div className={cn(
            "flex-1 overflow-hidden h-full relative",
            !hasMessages && "flex items-center justify-center"
          )}>
            {hasMessages ? (
              <div className="w-full h-full">
                <ChatMessageList>
                  {children}
                </ChatMessageList>
              </div>
            ) : (
              <div className="w-full max-w-3xl mx-auto px-4 space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold">
                    <span className="text-amber-500">BLOG</span>{" "}
                    <span className="text-zinc-400">MNKY</span>
                  </h1>
                  <p className="text-zinc-400 text-lg">
                    Your AI companion for exploring the MOOD MNKY blog. Ask me anything about our content, 
                    from fragrance and technology to philosophy and personal growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="group flex flex-col gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur p-4 text-left hover:bg-zinc-800/50 transition-all hover:border-amber-500/20 hover:shadow-[0_0_8px_0_rgba(245,158,11,0.1)]"
                      onClick={() => onSubmit?.(suggestion.title)}
                    >
                      <span className="font-medium text-zinc-200 group-hover:text-amber-500 transition-colors">
                        {suggestion.title}
                      </span>
                      <span className="text-sm text-zinc-400">
                        {suggestion.description}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                    >
                      <Search className="h-4 w-4" />
                      Web Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                    >
                      <Code className="h-4 w-4" />
                      Code Interpreter
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {hasMessages && (
            <div className={cn(
              "w-full max-w-3xl mx-auto fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-transparent"
            )}>
              <div className="flex items-center gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                >
                  <Search className="h-4 w-4" />
                  Web Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                >
                  <ImageIcon className="h-4 w-4" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 gap-2 rounded-xl border-zinc-700 hover:border-amber-500/20 hover:text-amber-500 transition-all"
                >
                  <Code className="h-4 w-4" />
                  Code Interpreter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
} 