-- Sync user roles with profiles for existing users
do $$
declare
  profile_record record;
begin
  -- First, clean up any orphaned user_roles
  delete from public.user_roles
  where user_id not in (select id from public.profiles);
  
  -- Then sync roles from profiles to user_roles
  for profile_record in 
    select id, role from public.profiles
    where id not in (select user_id from public.user_roles)
  loop
    insert into public.user_roles (user_id, role)
    values (profile_record.id, profile_record.role);
  end loop;
end;
$$;

-- Create a trigger to keep user_roles in sync with profiles
create or replace function public.sync_user_role()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    -- If role changed, update user_roles
    if new.role != old.role then
      update public.user_roles
      set role = new.role
      where user_id = new.id;
    end if;
  end if;
  return new;
end;
$$;

-- Drop the trigger if it exists
drop trigger if exists on_profile_role_change on public.profiles;

-- Create the trigger
create trigger on_profile_role_change
  after update on public.profiles
  for each row
  when (old.role is distinct from new.role)
  execute function public.sync_user_role(); 