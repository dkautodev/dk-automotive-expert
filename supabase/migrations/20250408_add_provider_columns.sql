
-- Add new columns to mission_attachments table for Google Drive integration
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
