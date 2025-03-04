export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      available_reactions: {
        Row: {
          id: string
          emoji: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          emoji: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          emoji?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      channel_members: {
        Row: {
          channel_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          user_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          channel_id: string
          user_id: string
          created_at: string
          updated_at: string
          metadata: Json | null
          is_deleted: boolean
          edited_at: string | null
        }
        Insert: {
          id?: string
          content: string
          channel_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
          is_deleted?: boolean
          edited_at?: string | null
        }
        Update: {
          id?: string
          content?: string
          channel_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
          is_deleted?: boolean
          edited_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          role: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
      }
    }
    Views: {
      messages_with_profiles: {
        Row: {
          id: string
          content: string
          channel_id: string
          user_id: string
          created_at: string
          updated_at: string
          metadata: Json | null
          is_deleted: boolean
          edited_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 