INSERT INTO public.channels (id, name, slug, type, description, is_private, is_direct, metadata, created_by) SELECT gen_random_uuid(), 'General', 'general', 'TEXT', 'General discussion channel', false, false, '{}'::jsonb, id FROM auth.users LIMIT 1;
