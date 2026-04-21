-- Ajout des colonnes manquantes à la table missions pour stocker tous les détails du devis
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS vehicle_vin TEXT,
ADD COLUMN IF NOT EXISTS vehicle_fuel TEXT,
ADD COLUMN IF NOT EXISTS pickup_date DATE,
ADD COLUMN IF NOT EXISTS pickup_time TEXT,
ADD COLUMN IF NOT EXISTS pickup_time_end TEXT,
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS delivery_time TEXT,
ADD COLUMN IF NOT EXISTS delivery_time_end TEXT,
ADD COLUMN IF NOT EXISTS pickup_contact_name TEXT,
ADD COLUMN IF NOT EXISTS pickup_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_contact_name TEXT,
ADD COLUMN IF NOT EXISTS delivery_contact_phone TEXT;

-- Mise à jour des commentaires pour la clarté
COMMENT ON COLUMN public.missions.status IS 'pending, confirmed, cancelled';
COMMENT ON COLUMN public.missions.payment_status IS 'unpaid, paid, refunded';
