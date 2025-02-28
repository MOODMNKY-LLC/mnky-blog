-- Ensure we have the user_role type
do $$ begin
  create type public.user_role as enum (
    'ADMIN',
    'MODERATOR',
    'USER'
  );
exception
  when duplicate_object then null;
end $$;

-- Create a function to handle profile creation with first-user admin logic
create or replace function public.handle_new_user()
returns trigger
security invoker -- Changed to invoker since we're using RLS
set search_path = public
language plpgsql
as $$
declare
  user_count int;
  new_role user_role;
  display_name text;
begin
  -- Count existing users
  select count(*) into user_count from public.profiles;
  
  -- Determine role and display name
  new_role := case 
    when user_count = 0 then 'ADMIN'::user_role
    else 'USER'::user_role
  end;
  
  display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  -- Create profile
  insert into public.profiles (
    id,
    email,
    role,
    avatar_url,
    display_name,
    full_name,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    new_role,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    display_name,
    coalesce(new.raw_user_meta_data->>'full_name', display_name),
    now(),
    now()
  );

  -- If this is the first user, create default channels
  if user_count = 0 then
    -- Create General channel
    insert into public.channels (
      name, 
      slug, 
      type, 
      description, 
      created_by
    )
    values (
      'General',
      'general',
      'TEXT',
      'Welcome to the general discussion channel',
      new.id
    );

    -- Create Announcements channel
    insert into public.channels (
      name, 
      slug, 
      type, 
      description, 
      created_by
    )
    values (
      'Announcements',
      'announcements',
      'ANNOUNCEMENT',
      'Important announcements and updates',
      new.id
    );

    -- Add the admin user to both channels
    insert into public.channel_members (
      channel_id,
      user_id,
      role
    )
    select 
      id,
      new.id,
      'OWNER'
    from public.channels
    where slug in ('general', 'announcements');
  end if;

  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$;

-- Drop the old trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create new trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 