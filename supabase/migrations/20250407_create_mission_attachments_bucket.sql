
-- Create storage bucket for mission attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission-attachments', 'Mission Attachments', true)
ON CONFLICT (id) DO NOTHING;

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
