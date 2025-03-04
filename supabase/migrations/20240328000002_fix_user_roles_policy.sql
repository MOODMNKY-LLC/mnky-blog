-- Drop existing policies
drop policy if exists "User roles are viewable by everyone." on user_roles;
drop policy if exists "Only admins can manage user roles." on user_roles;

-- Create new policies that use profiles table for admin checks
create policy "User roles are viewable by everyone."
  on user_roles for select
  to authenticated
  using (true);

create policy "Only admins can manage user roles."
  on user_roles for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can update user roles."
  on user_roles for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can delete user roles."
  on user_roles for delete
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  ); 