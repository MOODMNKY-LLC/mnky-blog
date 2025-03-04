-- Create function to update edited_at timestamp
CREATE OR REPLACE FUNCTION public.update_message_edited_timestamp()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $function$
BEGIN
    IF NEW.message <> OLD.message THEN
        NEW.is_edited := true;
        NEW.edited_at := current_timestamp;
    END IF;
    RETURN NEW;
END;
$function$;

-- Create trigger to automatically update edited_at
DROP TRIGGER IF EXISTS message_edited ON public.messages;
CREATE TRIGGER message_edited
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_message_edited_timestamp();