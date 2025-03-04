create view messages_with_profiles as
select 
  m.id,
  m.channel_id,
  m.user_id,
  m.message,
  m.type,
  m.parent_id,
  m.metadata,
  m.created_at,
  m.updated_at,
  m.deleted_at,
  p.username,
  p.avatar_url,
  p.display_name,
  p.role as user_role
from messages m
left join profiles p on m.user_id = p.id;