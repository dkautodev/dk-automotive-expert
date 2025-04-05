
-- Add new columns to mission_attachments table for Google Drive integration
-- Ajout des colonnes pour Google Drive dans la table mission_attachments
ALTER TABLE public.mission_attachments 
ADD COLUMN IF NOT EXISTS storage_provider TEXT,
ADD COLUMN IF NOT EXISTS provider_file_id TEXT,
ADD COLUMN IF NOT EXISTS provider_view_url TEXT,
ADD COLUMN IF NOT EXISTS provider_download_url TEXT;

-- Update RLS policies to cover new columns
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
