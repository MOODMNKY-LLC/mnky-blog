-- Migration: Create Chat System
-- Description: Sets up the real-time chat system with channels, messages, and presence
-- Dependencies: auth.users, public.profiles

-- Create custom types for chat system
do $$ begin
  create type public.channel_type as enum (
    'TEXT',
    'ANNOUNCEMENT',
    'BLOG_DISCUSSION',
    'FORUM_THREAD',
    'EVENT_CHAT',
    'DIRECT_MESSAGE'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.message_type as enum (
    'TEXT',
    'SYSTEM',
    'FILE',
    'CODE',
    'THREAD_REPLY',
    'VOICE_NOTE'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_status as enum (
    'ONLINE',
    'OFFLINE',
    'AWAY',
    'DO_NOT_DISTURB'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.member_role as enum (
    'OWNER',
    'ADMIN',
    'MODERATOR',
    'MEMBER'
  );
exception
  when duplicate_object then null;
end $$;

-- Create channels table
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type channel_type not null default 'TEXT',
  description text,
  is_private boolean default false,
  is_direct boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone,
  constraint valid_name check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint valid_slug check (char_length(slug) >= 1 and char_length(slug) <= 100)
);
comment on table public.channels is 'Chat channels including direct messages, group chats, and public channels';

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  parent_id uuid references public.messages on delete cascade,
  message text,
  type message_type default 'TEXT',
  metadata jsonb default '{}'::jsonb,
  is_edited boolean default false,
  edited_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  constraint valid_message check (
    (type = 'TEXT' and message is not null) or
    (type in ('FILE', 'CODE', 'VOICE_NOTE') and metadata is not null)
  )
);
comment on table public.messages is 'Chat messages with support for threads, types, and metadata';

-- Create channel members table
create table if not exists public.channel_members (
  channel_id uuid references public.channels on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role member_role default 'MEMBER',
  last_read_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (channel_id, user_id)
);
comment on table public.channel_members is 'Channel membership and roles';

-- Create message reactions table
create table if not exists public.message_reactions (
  message_id uuid references public.messages on delete cascade,
  user_id uuid references auth.users on delete cascade,
  emoji text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (message_id, user_id, emoji)
);
comment on table public.message_reactions is 'Emoji reactions on messages';

-- Create typing indicators table
create table if not exists public.typing_indicators (
  channel_id uuid references public.channels on delete cascade,
  user_id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (channel_id, user_id)
);
comment on table public.typing_indicators is 'User typing status in channels';

-- Create user presence table
create table if not exists public.user_presence (
  user_id uuid references auth.users on delete cascade primary key,
  status user_status default 'OFFLINE',
  status_message text,
  last_seen_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.user_presence is 'User online status and presence information';

-- Create function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger handle_updated_at_channels
  before update on public.channels
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at_messages
  before update on public.messages
  for each row execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.channel_members enable row level security;
alter table public.message_reactions enable row level security;
alter table public.typing_indicators enable row level security;
alter table public.user_presence enable row level security;

-- Channel Policies
create policy "Channels are viewable by members"
  on public.channels
  for select
  using (
    auth.role() = 'authenticated' and (
      not is_private or
      exists (
        select 1 from public.channel_members
        where channel_id = id and user_id = auth.uid()
      )
    )
  );

create policy "Users can create channels"
  on public.channels
  for insert
  with check (auth.role() = 'authenticated');

create policy "Channel admins can update channels"
  on public.channels
  for update
  using (
    exists (
      select 1 from public.channel_members
      where channel_id = id 
      and user_id = auth.uid()
      and role in ('ADMIN', 'OWNER')
    )
  );

-- Message Policies
create policy "Messages are viewable by channel members"
  on public.messages
  for select
  using (
    exists (
      select 1 from public.channel_members
      where channel_id = messages.channel_id
      and user_id = auth.uid()
    )
  );

create policy "Channel members can send messages"
  on public.messages
  for insert
  with check (
    exists (
      select 1 from public.channel_members
      where channel_id = messages.channel_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update own messages"
  on public.messages
  for update
  using (user_id = auth.uid());

-- Channel Member Policies
create policy "Channel membership is viewable by members"
  on public.channel_members
  for select
  using (
    exists (
      select 1 from public.channel_members
      where channel_id = channel_members.channel_id
      and user_id = auth.uid()
    )
  );

create policy "Users can join public channels"
  on public.channel_members
  for insert
  with check (
    auth.role() = 'authenticated' and
    not exists (
      select 1 from public.channels
      where id = channel_id and is_private = true
    )
  );

-- Message Reaction Policies
create policy "Message reactions are viewable by channel members"
  on public.message_reactions
  for select
  using (
    exists (
      select 1 from public.channel_members cm
      join public.messages m on m.channel_id = cm.channel_id
      where m.id = message_id and cm.user_id = auth.uid()
    )
  );

create policy "Channel members can react to messages"
  on public.message_reactions
  for insert
  with check (
    exists (
      select 1 from public.channel_members cm
      join public.messages m on m.channel_id = cm.channel_id
      where m.id = message_id and cm.user_id = auth.uid()
    )
  );

-- Typing Indicator Policies
create policy "Typing indicators are viewable by channel members"
  on public.typing_indicators
  for select
  using (
    exists (
      select 1 from public.channel_members
      where channel_id = typing_indicators.channel_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update their typing status"
  on public.typing_indicators
  for insert
  with check (auth.uid() = user_id);

-- User Presence Policies
create policy "User presence is viewable by authenticated users"
  on public.user_presence
  for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own presence"
  on public.user_presence
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own presence"
  on public.user_presence
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.channels;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.channel_members;
alter publication supabase_realtime add table public.typing_indicators;
alter publication supabase_realtime add table public.user_presence; 