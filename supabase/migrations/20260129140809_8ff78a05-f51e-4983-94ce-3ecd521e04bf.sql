-- Create social_links table for managing social media links in navbar
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  platform_label text NOT NULL,
  url text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active social links" 
ON public.social_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can insert social links" 
ON public.social_links 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update social links" 
ON public.social_links 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete social links" 
ON public.social_links 
FOR DELETE 
USING (is_admin());

-- Insert default social links
INSERT INTO public.social_links (platform, platform_label, url, icon, display_order)
VALUES 
  ('facebook', 'Facebook', 'https://facebook.com/', 'facebook', 1),
  ('instagram', 'Instagram', 'https://instagram.com/', 'instagram', 2);