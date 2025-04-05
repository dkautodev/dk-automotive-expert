
-- Create storage bucket for mission attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission-attachments', 'Mission Attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for mission attachments
CREATE TABLE IF NOT EXISTS public.mission_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for mission_attachments table
ALTER TABLE public.mission_attachments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select mission attachments
CREATE POLICY "Users can view mission attachments"
ON public.mission_attachments
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert mission attachments
CREATE POLICY "Users can insert mission attachments"
ON public.mission_attachments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own attachments
CREATE POLICY "Users can update their own attachments"
ON public.mission_attachments
FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid());

-- Allow authenticated users to delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON public.mission_attachments
FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());

-- Create storage policy to allow authenticated users to upload mission attachments
CREATE POLICY "Users can upload mission attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mission-attachments');

-- Create storage policy to allow users to read mission attachments
CREATE POLICY "Users can read mission attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'mission-attachments');

-- Create storage policy to allow users to update their mission attachments
CREATE POLICY "Users can update mission attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'mission-attachments');

-- Create storage policy to allow users to delete their mission attachments
CREATE POLICY "Users can delete mission attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'mission-attachments');

-- Add trigger to update updated_at when a record is modified
CREATE TRIGGER update_mission_attachments_updated_at_trigger
BEFORE UPDATE ON public.mission_attachments
FOR EACH ROW
EXECUTE FUNCTION update_mission_attachments_updated_at();

-- Create function for the trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_mission_attachments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
