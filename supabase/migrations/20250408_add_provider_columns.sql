
-- Add storage_provider column to mission_attachments table
ALTER TABLE public.mission_attachments 
ADD COLUMN IF NOT EXISTS storage_provider TEXT;

-- Update RLS policies to cover new column
ALTER POLICY "Users can view mission attachments" 
ON public.mission_attachments 
USING (true);

ALTER POLICY "Users can insert mission attachments" 
ON public.mission_attachments 
WITH CHECK (true);

-- Mise à jour des enregistrements existants pour spécifier 'supabase' comme provider
UPDATE mission_attachments
SET storage_provider = 'supabase'
WHERE storage_provider IS NULL;
