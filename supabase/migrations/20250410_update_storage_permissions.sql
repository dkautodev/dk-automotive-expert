
-- Update storage policy to allow users to delete mission attachments
-- This overrides the previous policy to ensure all authenticated users can delete files
DROP POLICY IF EXISTS "Users can delete mission attachments" ON storage.objects;

CREATE POLICY "Users can delete mission attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'mission-attachments' AND
  (
    -- Allow admins to delete any file
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'admin' OR
        raw_user_meta_data->>'user_type' = 'admin'
      )
    )
    OR
    -- Allow clients to delete their own files
    EXISTS (
      SELECT 1
      FROM mission_attachments ma
      WHERE ma.file_path = storage.objects.name
      AND ma.uploaded_by = auth.uid()
    )
    OR
    -- Special case for the admin email
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dkautomotive70@gmail.com'
  )
);

-- Update database permissions to ensure proper file deletion
DROP POLICY IF EXISTS "Users can delete their own attachments" ON public.mission_attachments;

CREATE POLICY "Users can delete their own attachments"
ON public.mission_attachments
FOR DELETE
TO authenticated
USING (
  -- Allow admins to delete any attachment
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND (
      raw_user_meta_data->>'role' = 'admin' OR 
      raw_user_meta_data->>'user_type' = 'admin'
    )
  )
  OR
  -- Allow users to delete their own attachments
  uploaded_by = auth.uid()
  OR
  -- Special case for the admin email
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dkautomotive70@gmail.com'
);

-- Create policy that prevents drivers from deleting attachments
CREATE POLICY "Drivers cannot delete attachments"
ON public.mission_attachments
FOR DELETE
TO authenticated
USING (
  -- Ensure the user is not a driver
  NOT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND (
      raw_user_meta_data->>'role' = 'driver' OR 
      raw_user_meta_data->>'user_type' = 'driver'
    )
  )
);
