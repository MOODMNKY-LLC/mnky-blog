-- Drop the existing trigger first
drop trigger if exists on_auth_user_created on auth.users;

-- Update the handle_new_user function to handle all profile fields
create or replace function public.handle_new_user()
returns trigger
security definer -- Changed back to definer since we need to bypass RLS
set search_path = public
language plpgsql
as $$
declare
  user_count int;
  new_role app_role;
  display_name text;
begin
  -- Count existing users
  select count(*) into user_count from public.profiles;
  
  -- Determine role
  new_role := case 
    when user_count = 0 then 'admin'::app_role
    else 'user'::app_role
  end;
  
  -- Get display name from metadata or email
  display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  -- Create profile with all fields
  insert into public.profiles (
    id,
    email,
    username,
    full_name,
    display_name,
    avatar_url,
    role,
    preferences,
    created_at,
    updated_at,
    last_sign_in
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'username',
      'user_' || substr(new.id::text, 1, 8)
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      display_name
    ),
    display_name,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/pixel-art/png?seed=' || new.id::text
    ),
    new_role,
    '{"theme": {"mode": "dark"}, "notifications": {"email": true}}'::jsonb,
    now(),
    now(),
    now()
  );

  -- If this is the first user (admin), create default channels
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

-- Create new trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 