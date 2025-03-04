-- Add member_count column to channels table
ALTER TABLE public.channels
ADD COLUMN member_count integer DEFAULT 0 NOT NULL;

-- Create function to update member count
CREATE OR REPLACE FUNCTION public.update_channel_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.channels
    SET member_count = member_count + 1
    WHERE id = NEW.channel_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.channels
    SET member_count = member_count - 1
    WHERE id = OLD.channel_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update member count
DROP TRIGGER IF EXISTS update_channel_member_count_trigger ON public.channel_members;
CREATE TRIGGER update_channel_member_count_trigger
  AFTER INSERT OR DELETE ON public.channel_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_channel_member_count();

-- Update existing member counts
UPDATE public.channels c
SET member_count = (
  SELECT COUNT(*)
  FROM public.channel_members cm
  WHERE cm.channel_id = c.id
); 