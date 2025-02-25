-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their avatar." on storage.objects
  for update using (bucket_id = 'avatars');

create policy "Anyone can delete their avatar." on storage.objects
  for delete using (bucket_id = 'avatars');

-- Create function to handle storage cleanup on profile deletion
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all storage objects for the user
  DELETE FROM storage.objects
  WHERE bucket_id = 'avatars'
  AND name LIKE OLD.id || '%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion cleanup
CREATE TRIGGER on_profile_deleted
  BEFORE DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deleted_user();

-- Add storage size limits
DO $$
BEGIN
  -- Set maximum file size for avatars (5MB)
  PERFORM set_config('storage.max_size', '5242880', false);
END $$; 