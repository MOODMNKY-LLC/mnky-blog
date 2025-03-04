-- Drop existing policies
drop policy if exists "Channel members are viewable by other members" on channel_members;
drop policy if exists "Channel members are viewable by channel members" on channel_members;
drop policy if exists "Channel membership is viewable by members" on channel_members;
drop policy if exists "Channel members are viewable by channel members and public channels" on channel_members;
drop policy if exists "Users can join channels" on channel_members;
drop policy if exists "Members viewable in public channels or if user is member" on channel_members;
drop policy if exists "Users can join public channels or own channels" on channel_members;
drop policy if exists "Users can update own membership or if admin" on channel_members;
drop policy if exists "Users can leave channels or admins can remove members" on channel_members;

-- Simple permissive policies for authenticated users
create policy "Allow authenticated users to view channel members"
  on channel_members
  for select
  to authenticated
  using (true);

create policy "Allow authenticated users to join channels"
  on channel_members
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update channel members"
  on channel_members
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users to leave channels"
  on channel_members
  for delete
  to authenticated
  using (true);

-- Add index to improve policy performance
create index if not exists idx_channel_members_channel_user
  on channel_members(channel_id, user_id); 