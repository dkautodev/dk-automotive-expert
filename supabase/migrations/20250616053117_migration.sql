
-- Create security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Enable RLS on all content tables
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookie_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgv_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgu_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_space_settings ENABLE ROW LEVEL SECURITY;
-- page_contents already has RLS enabled

-- FAQ Items policies
CREATE POLICY "Public can view active FAQ items" 
  ON public.faq_items 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert FAQ items" 
  ON public.faq_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update FAQ items" 
  ON public.faq_items 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete FAQ items" 
  ON public.faq_items 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- Legal Mentions policies
CREATE POLICY "Public can view active legal mentions" 
  ON public.legal_mentions 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert legal mentions" 
  ON public.legal_mentions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update legal mentions" 
  ON public.legal_mentions 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete legal mentions" 
  ON public.legal_mentions 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- Privacy Policy policies
CREATE POLICY "Public can view active privacy policy sections" 
  ON public.privacy_policy 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert privacy policy sections" 
  ON public.privacy_policy 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update privacy policy sections" 
  ON public.privacy_policy 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete privacy policy sections" 
  ON public.privacy_policy 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- Cookie Management policies
CREATE POLICY "Public can view active cookie management sections" 
  ON public.cookie_management 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert cookie management sections" 
  ON public.cookie_management 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update cookie management sections" 
  ON public.cookie_management 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete cookie management sections" 
  ON public.cookie_management 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- CGV Content policies
CREATE POLICY "Public can view active CGV content sections" 
  ON public.cgv_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert CGV content sections" 
  ON public.cgv_content 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update CGV content sections" 
  ON public.cgv_content 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete CGV content sections" 
  ON public.cgv_content 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- CGU Content policies
CREATE POLICY "Public can view active CGU content sections" 
  ON public.cgu_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert CGU content sections" 
  ON public.cgu_content 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update CGU content sections" 
  ON public.cgu_content 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete CGU content sections" 
  ON public.cgu_content 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- Professional Space Settings policies
CREATE POLICY "Public can view active professional space settings" 
  ON public.professional_space_settings 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert professional space settings" 
  ON public.professional_space_settings 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update professional space settings" 
  ON public.professional_space_settings 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete professional space settings" 
  ON public.professional_space_settings 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- Update existing page_contents policies to use the new is_admin function
DROP POLICY IF EXISTS "Authenticated can update page_contents" ON public.page_contents;
DROP POLICY IF EXISTS "Authenticated can insert page_contents" ON public.page_contents;
DROP POLICY IF EXISTS "Authenticated can delete page_contents" ON public.page_contents;

CREATE POLICY "Public can view active page contents" 
  ON public.page_contents 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can insert page contents" 
  ON public.page_contents 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update page contents" 
  ON public.page_contents 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can delete page contents" 
  ON public.page_contents 
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());
