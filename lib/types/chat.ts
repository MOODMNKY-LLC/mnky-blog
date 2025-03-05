export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface MessageMetadata {
  attachments?: Array<{
    type: string;
    url: string;
  }>;
  reactions?: Reaction[];
  pinned?: boolean;
  pinned_at?: string;
  pinned_by?: string;
  edited?: boolean;
  edited_at?: string;
  mentions?: string[];
  embeds?: Array<{
    type: string;
    data: unknown;
  }>;
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  message: string;
  type: 'TEXT' | 'MEDIA' | 'SYSTEM' | 'VOICE' | 'CODE';
  parent_id?: string;
  metadata: MessageMetadata;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  profile: {
    username: string;
    avatar_url: string | null;
    display_name: string | null;
    role: string;
  };
}

export interface MessageWithProfile extends Message {
  username: string;
  avatar_url: string | null;
  display_name: string | null;
  user_role: string;
  full_name?: string;
  role?: string;
} 