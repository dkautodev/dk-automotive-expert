
-- Add admin_id column to missions table
ALTER TABLE public.missions 
ADD COLUMN admin_id UUID REFERENCES auth.users(id);

-- Set default admin ID for existing records
-- Note: Replace the UUID below with your actual admin user ID
UPDATE public.missions 
SET admin_id = '00000000-0000-0000-0000-000000000000'
WHERE admin_id IS NULL;

-- Create function to set admin_id on mission creation
CREATE OR REPLACE FUNCTION public.set_default_admin_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If admin_id is not set, use default admin ID
  -- Replace with your actual admin user ID
  IF NEW.admin_id IS NULL THEN
    NEW.admin_id = '00000000-0000-0000-0000-000000000000';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to apply the function
CREATE TRIGGER set_default_admin_id_trigger
BEFORE INSERT ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.set_default_admin_id();
