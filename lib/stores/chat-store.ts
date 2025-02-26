import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
  pending?: boolean
  error?: boolean
  config?: Record<string, unknown>
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  createSession: () => string
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void
  deleteSession: (sessionId: string) => void
  setCurrentSession: (sessionId: string) => void
  addMessage: (sessionId: string, message: Message) => void
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  clearSessions: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      createSession: () => {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set(state => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        }))

        return newSession.id
      },

      updateSession: (sessionId, updates) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, ...updates, updatedAt: new Date().toISOString() }
              : session
          ),
        }))
      },

      deleteSession: (sessionId) => {
        set(state => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId)
          const newCurrentId = state.currentSessionId === sessionId
            ? newSessions[0]?.id ?? null
            : state.currentSessionId

          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          }
        })
      },

      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },

      addMessage: (sessionId, message) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date().toISOString(),
                  title: session.messages.length === 0 && message.isUser
                    ? message.content.slice(0, 50)
                    : session.title,
                }
              : session
          ),
        }))
      },

      updateMessage: (sessionId, messageId, updates) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map(msg =>
                    msg.id === messageId
                      ? { ...msg, ...updates }
                      : msg
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : session
          ),
        }))
      },

      clearSessions: () => {
        set({ sessions: [], currentSessionId: null })
      },
    }),
    {
      name: 'chat-store',
    }
  )
) 