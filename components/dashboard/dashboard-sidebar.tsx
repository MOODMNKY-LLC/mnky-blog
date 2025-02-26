import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChartIcon,
  FileTextIcon,
  GearIcon,
  ImageIcon,
  PersonIcon,
  ChatBubbleIcon,
  PlusIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons"
import { useChatStore } from "@/lib/stores/chat-store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface DashboardSidebarProps {
  // This interface is intentionally left empty as it may be extended in the future
  // and serves as a base for component props
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const {
    sessions,
    currentSessionId,
    createSession,
    setCurrentSession,
    deleteSession,
    clearSessions,
    updateSession,
  } = useChatStore()

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const handleNewChat = () => {
    createSession()
  }

  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = (sessionId: string) => {
    if (editingTitle.trim()) {
      updateSession(sessionId, { title: editingTitle.trim() })
    }
    setEditingSessionId(null)
    setEditingTitle("")
  }

  return (
    <div className={cn("pb-12 flex flex-col h-full", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50"
              onClick={handleNewChat}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Posts
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ImageIcon className="mr-2 h-4 w-4" />
              Media
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PersonIcon className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <GearIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-zinc-400">Recent Chats</h2>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chat sessions?')) {
                    clearSessions();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear all chats</span>
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {sessions.map((session) => (
                <div key={session.id} className="group relative flex items-center">
                  <Button
                    variant={session.id === currentSessionId ? "secondary" : "ghost"}
                    className="w-full justify-start pr-8"
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <ChatBubbleIcon className="mr-2 h-4 w-4" />
                    <div className="flex-1 truncate text-left">
                      {editingSessionId === session.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveRename(session.id)
                            } else if (e.key === 'Escape') {
                              setEditingSessionId(null)
                              setEditingTitle("")
                            }
                          }}
                          onBlur={() => handleSaveRename(session.id)}
                          className="h-6 px-1 py-0 text-sm bg-zinc-800/50"
                          autoFocus
                        />
                      ) : (
                        <>
                          <div className="truncate">{session.title}</div>
                          <div className="text-xs text-zinc-400">
                            {format(new Date(session.updatedAt), 'MMM d, h:mm a')}
                          </div>
                        </>
                      )}
                    </div>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 h-6 w-6 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem 
                        className="text-zinc-400 hover:text-amber-500 focus:text-amber-500 cursor-pointer"
                        onClick={() => handleRenameSession(session.id, session.title)}
                      >
                        <Pencil1Icon className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 hover:text-red-400 focus:text-red-400 cursor-pointer"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
} 