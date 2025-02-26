# BLOG MNKY Community Features

## Overview
BLOG MNKY's community section is designed as a Discord-inspired space that combines real-time chat, threaded discussions, and private messaging. The community features are built to foster engagement while maintaining our unique aesthetic of frosted glass and amber accents.

## Core Features

### 1. Channel System
- **Public Channels**: General discussion spaces
- **Private Channels**: Member-only or role-restricted spaces
- **Announcement Channels**: Official communications
- **Blog Discussion Channels**: Automatically created for blog post discussions

### 2. Real-time Chat
- WebSocket-based instant messaging
- Rich text formatting with Markdown support
- File and media sharing
- Emoji reactions
- Message threading
- Typing indicators
- Read receipts

### 3. Forum/Discussions
- Threaded conversations
- Category organization
- Pinned topics
- Poll creation
- Tag system
- Search functionality

### 4. Direct Messaging
- Private one-on-one conversations
- Group messaging
- Message requests system
- Online status indicators
- Read receipts
- Media sharing

### 5. Member System
- Profile customization
- Role-based permissions
- Activity tracking
- Reputation system
- Member directory
- Online presence

## Technical Architecture

### Database Schema (Supabase)

```sql
-- Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TEXT', 'ANNOUNCEMENT', 'FORUM', 'BLOG_DISCUSSION')),
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'TEXT',
  parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Message Reactions
CREATE TABLE message_reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id, emoji)
);

-- Direct Messages
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Channel Members
CREATE TABLE channel_members (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

-- User Profiles (Extended)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'OFFLINE',
  last_seen TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Quotes System
CREATE TABLE daily_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inspiration', 'philosophy', 'technology', 'community', 'gaming', 'mental_health')),
  source TEXT,
  context TEXT,
  is_active BOOLEAN DEFAULT true,
  display_start TIMESTAMPTZ,
  display_end TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Quote Categories
CREATE TABLE quote_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote-Category Relationships
CREATE TABLE quote_category_relations (
  quote_id UUID REFERENCES daily_quotes(id) ON DELETE CASCADE,
  category_id UUID REFERENCES quote_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (quote_id, category_id)
);

-- Quote Reactions
CREATE TABLE quote_reactions (
  quote_id UUID REFERENCES daily_quotes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (quote_id, user_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_daily_quotes_updated_at
  BEFORE UPDATE ON daily_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_categories_updated_at
  BEFORE UPDATE ON quote_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_category_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_quotes
CREATE POLICY "Anyone can read active quotes"
  ON daily_quotes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create quotes"
  ON daily_quotes FOR INSERT
  WITH CHECK (auth.role() IN ('admin', 'moderator'));

CREATE POLICY "Admins and moderators can update quotes"
  ON daily_quotes FOR UPDATE
  USING (auth.role() IN ('admin', 'moderator'));

-- RLS Policies for quote reactions
CREATE POLICY "Anyone can read quote reactions"
  ON quote_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can react to quotes"
  ON quote_reactions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own reactions"
  ON quote_reactions FOR DELETE
  USING (auth.uid() = user_id);
```

### TypeScript Interfaces

```typescript
// Core Types
interface Channel {
  id: string;
  name: string;
  type: 'TEXT' | 'ANNOUNCEMENT' | 'FORUM' | 'BLOG_DISCUSSION';
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  type: 'TEXT' | 'MEDIA' | 'SYSTEM';
  parentId?: string;
  metadata: {
    attachments?: Attachment[];
    mentions?: string[];
    embeds?: Embed[];
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  status: 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE';
  lastSeen: string;
  preferences: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

// Quote System Types
interface Quote {
  id: string;
  text: string;
  author: string;
  type: 'inspiration' | 'philosophy' | 'technology' | 'community' | 'gaming' | 'mental_health';
  source?: string;
  context?: string;
  isActive: boolean;
  displayStart?: string;
  displayEnd?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
  categories?: QuoteCategory[];
  reactions?: QuoteReaction[];
}

interface QuoteCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QuoteReaction {
  quoteId: string;
  userId: string;
  reactionType: string;
  createdAt: string;
}

interface QuoteCategoryRelation {
  quoteId: string;
  categoryId: string;
  createdAt: string;
}
```

## Component Structure

```
components/
  community/
    layout/
      CommunityLayout.tsx       # Main 3-column layout
      ChannelsSidebar.tsx       # Left sidebar
      ChannelContent.tsx        # Main content area
      MembersList.tsx           # Right sidebar
    
    channels/
      ChannelHeader.tsx         # Channel info & controls
      MessageList.tsx           # Message display
      MessageInput.tsx          # Message composer
      MessageCard.tsx           # Individual message
    
    forum/
      ThreadList.tsx            # Forum threads
      ThreadView.tsx            # Single thread
      ThreadComposer.tsx        # Create/edit thread
    
    messages/
      DMList.tsx               # Direct message list
      DMConversation.tsx       # DM thread view
      DMComposer.tsx           # DM input
    
    shared/
      UserAvatar.tsx           # User avatar with status
      ReactionPicker.tsx       # Emoji reaction selector
      FileUploader.tsx         # Media upload
      RichTextEditor.tsx       # Text formatting
      Mentions.tsx             # @mentions system
```

## Routing Structure

```
app/
  community/
    layout.tsx                 # Community layout wrapper
    page.tsx                  # Community home
    
    channels/
      page.tsx                # Channels list
      [channelId]/
        page.tsx              # Channel view
        threads/
          [threadId]/
            page.tsx          # Thread view
    
    messages/
      page.tsx               # DM list
      [userId]/
        page.tsx             # Conversation
    
    members/
      page.tsx               # Member directory
      [memberId]/
        page.tsx             # Member profile
```

## UI/UX Guidelines

### Layout
- Three-column Discord-inspired layout
- Collapsible sidebars for mobile
- Persistent navigation
- Smooth transitions between views

### Styling
- Frosted glass effect (`backdrop-blur-md bg-zinc-900/50`)
- Amber accent colors
- Consistent hover states
- Responsive design
- Dark mode optimized

### Interactions
- Real-time updates
- Infinite scroll for messages
- Smooth animations
- Touch-friendly controls
- Keyboard shortcuts

## Implementation Phases

### Phase 1: Foundation
- [ ] Basic layout components
- [ ] Channel system
- [ ] Message display
- [ ] User profiles

### Phase 2: Real-time Features
- [ ] WebSocket integration
- [ ] Live messaging
- [ ] Typing indicators
- [ ] Online presence

### Phase 3: Rich Features
- [ ] File uploads
- [ ] Rich text formatting
- [ ] Reactions
- [ ] Mentions

### Phase 4: Forum & Threads
- [ ] Thread system
- [ ] Forum organization
- [ ] Search functionality
- [ ] Moderation tools

### Phase 5: Polish & Performance
- [ ] Optimization
- [ ] Analytics
- [ ] Admin dashboard
- [ ] API documentation

## Notes
- Keep this document updated as features are implemented
- Document any deviations from the plan
- Track performance implications
- Note security considerations
- Maintain consistent BLOG MNKY branding throughout the UI

## Resources
- Discord UI reference
- WebSocket documentation
- Supabase real-time features
- React optimization guides 