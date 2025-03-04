-- Create handle_updated_at function if it doesn't exist
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

-- Create available reactions table for admin control
create table if not exists public.available_reactions (
  id uuid primary key default gen_random_uuid(),
  emoji text not null unique,
  name text not null,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users on delete set null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.available_reactions is 'Admin-controlled list of available reactions';

-- Add trigger for updated_at
drop trigger if exists handle_updated_at_available_reactions on public.available_reactions;
create trigger handle_updated_at_available_reactions
  before update on public.available_reactions
  for each row execute function public.handle_updated_at();

-- Enable RLS
alter table public.available_reactions enable row level security;

-- Available Reactions Policies
drop policy if exists "Available reactions are viewable by all users" on public.available_reactions;
create policy "Available reactions are viewable by all users"
  on public.available_reactions
  for select
  to authenticated, anon
  using (is_active = true);

drop policy if exists "Only administrators can manage available reactions" on public.available_reactions;
create policy "Only administrators can manage available reactions"
  on public.available_reactions
  for all
  to authenticated
  using (
    exists (
      select 1 from auth.users
      where auth.uid() = id
      and raw_app_meta_data->>'role' = 'administrator'
    )
  );

-- Create message_reactions table if it doesn't exist
create table if not exists public.message_reactions (
  message_id uuid not null references public.messages on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  emoji text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (message_id, user_id, emoji)
);

-- Add foreign key to available_reactions
alter table public.message_reactions
  drop constraint if exists message_reactions_emoji_fkey,
  add constraint message_reactions_emoji_fkey
  foreign key (emoji) references public.available_reactions(emoji)
  on delete restrict;

-- Enable RLS on message_reactions
alter table public.message_reactions enable row level security;

-- Message Reactions Policies
drop policy if exists "Users can manage their own reactions" on public.message_reactions;
create policy "Users can manage their own reactions"
  on public.message_reactions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Reactions are viewable by all users" on public.message_reactions;
create policy "Reactions are viewable by all users"
  on public.message_reactions
  for select
  to authenticated, anon
  using (true);

-- Add reaction counts materialized view for performance
drop materialized view if exists public.reaction_counts;
create materialized view public.reaction_counts as
select 
  mr.message_id,
  mr.emoji,
  count(*) as count,
  array_agg(p.full_name) as user_names
from public.message_reactions mr
join public.profiles p on p.id = mr.user_id
group by mr.message_id, mr.emoji;

comment on materialized view public.reaction_counts is 'Cached counts and user lists for message reactions';

-- Create function to refresh reaction counts
create or replace function public.refresh_reaction_counts()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  refresh materialized view concurrently reaction_counts;
  return null;
end;
$$;

-- Create trigger to refresh counts
drop trigger if exists refresh_reaction_counts_trigger on public.message_reactions;
create trigger refresh_reaction_counts_trigger
  after insert or update or delete
  on public.message_reactions
  for each statement
  execute function public.refresh_reaction_counts();

-- Insert default reactions
insert into public.available_reactions (emoji, name, description, created_by, is_active)
values 
  ('👍', 'thumbs_up', 'Like', null, true),
  ('❤️', 'heart', 'Love', null, true),
  ('😄', 'smile', 'Smile', null, true),
  ('🎉', 'tada', 'Celebrate', null, true),
  ('🤔', 'thinking', 'Thinking', null, true),
  ('😢', 'cry', 'Sad', null, true),
  ('😠', 'angry', 'Angry', null, true),
  ('🚀', 'rocket', 'Ship It!', null, true)
on conflict (emoji) 
do update set 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true; 