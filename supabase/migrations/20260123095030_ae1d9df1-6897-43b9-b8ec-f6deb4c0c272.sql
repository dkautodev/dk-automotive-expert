-- Create missions table to store pre-orders
CREATE TABLE public.missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Pickup info
  pickup_address TEXT NOT NULL,
  pickup_city TEXT,
  pickup_postal_code TEXT,
  
  -- Delivery info
  delivery_address TEXT NOT NULL,
  delivery_city TEXT,
  delivery_postal_code TEXT,
  
  -- Distance and pricing
  distance_km NUMERIC,
  price_ht NUMERIC,
  price_ttc NUMERIC,
  
  -- Vehicle info
  vehicle_type TEXT,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  vehicle_year TEXT,
  vehicle_fuel TEXT,
  license_plate TEXT,
  
  -- Contact info
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_company TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_intent_id TEXT,
  
  -- Notes
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Only admins can view missions
CREATE POLICY "Admins can view all missions"
ON public.missions
FOR SELECT
USING (is_admin());

-- Only admins can insert missions (for now, will be updated for Stripe webhook)
CREATE POLICY "Admins can insert missions"
ON public.missions
FOR INSERT
WITH CHECK (is_admin());

-- Only admins can update missions
CREATE POLICY "Admins can update missions"
ON public.missions
FOR UPDATE
USING (is_admin());

-- Only admins can delete missions
CREATE POLICY "Admins can delete missions"
ON public.missions
FOR DELETE
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_missions_updated_at
BEFORE UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();