
-- Create table for professional space settings
CREATE TABLE public.professional_space_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_label TEXT NOT NULL,
  setting_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data for professional space link
INSERT INTO public.professional_space_settings (setting_key, setting_label, setting_value) VALUES
('professional_space_url', 'URL de l''espace professionnel', 'https://app-private.dkautomotive.fr');

-- Add trigger for updated_at
CREATE TRIGGER update_professional_space_settings_updated_at
  BEFORE UPDATE ON public.professional_space_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
