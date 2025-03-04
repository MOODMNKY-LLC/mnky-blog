-- Drop the existing materialized view
drop materialized view if exists public.reaction_counts;

-- Recreate the materialized view with an index
create materialized view public.reaction_counts as
select 
  mr.message_id,
  mr.emoji,
  count(*) as count,
  array_agg(p.full_name) as user_names
from public.message_reactions mr
join public.profiles p on p.id = mr.user_id
group by mr.message_id, mr.emoji;

-- Add a unique index to support concurrent refresh
create unique index reaction_counts_message_emoji_idx 
  on public.reaction_counts (message_id, emoji);

-- Refresh the view normally first time
refresh materialized view public.reaction_counts; 