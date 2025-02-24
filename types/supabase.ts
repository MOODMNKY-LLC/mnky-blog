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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: Json
          excerpt: string | null
          featured_image: string | null
          status: 'draft' | 'published'
          author_id: string
          created_at: string
          updated_at: string | null
          published_at: string | null
          slug: string
          category: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          content: Json
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          author_id: string
          created_at?: string
          updated_at?: string | null
          published_at?: string | null
          slug: string
          category?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          content?: Json
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          author_id?: string
          created_at?: string
          updated_at?: string | null
          published_at?: string | null
          slug?: string
          category?: string | null
          tags?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 