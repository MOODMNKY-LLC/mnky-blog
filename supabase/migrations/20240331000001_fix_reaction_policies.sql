-- Drop existing policies
drop policy if exists "Available reactions are viewable by everyone" on public.available_reactions;
drop policy if exists "Administrators can manage reactions" on public.available_reactions;
drop policy if exists "Users can manage their own reactions" on public.message_reactions;
drop policy if exists "Reactions are viewable by everyone" on public.message_reactions;

-- Create more permissive policies for available_reactions
create policy "Available reactions are viewable by everyone"
  on public.available_reactions
  for select
  to authenticated, anon
  using (true);

create policy "Administrators can manage reactions"
  on public.available_reactions
  for all
  to authenticated
  using (
    exists (
      select 1 
      from public.profiles 
      where id = auth.uid() 
      and role = 'admin'
    )
  );

-- Create more permissive policies for message_reactions
create policy "Users can add reactions"
  on public.message_reactions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own reactions"
  on public.message_reactions
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Everyone can view reactions"
  on public.message_reactions
  for select
  to authenticated, anon
  using (true);

-- Refresh the materialized view
refresh materialized view public.reaction_counts; 