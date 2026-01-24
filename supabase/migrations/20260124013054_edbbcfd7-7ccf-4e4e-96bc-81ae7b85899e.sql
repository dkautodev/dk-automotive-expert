-- Add new columns to missions table for dates, times, VIN, and contacts
ALTER TABLE public.missions
ADD COLUMN IF NOT EXISTS pickup_date date,
ADD COLUMN IF NOT EXISTS pickup_time text,
ADD COLUMN IF NOT EXISTS delivery_date date,
ADD COLUMN IF NOT EXISTS delivery_time text,
ADD COLUMN IF NOT EXISTS vehicle_vin text,
ADD COLUMN IF NOT EXISTS pickup_contact_name text,
ADD COLUMN IF NOT EXISTS pickup_contact_phone text,
ADD COLUMN IF NOT EXISTS delivery_contact_name text,
ADD COLUMN IF NOT EXISTS delivery_contact_phone text;