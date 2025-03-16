
import { Database } from "@/integrations/supabase/types";

export type QuoteRow = {
  id: string;
  quote_number: string;
  pickup_address: string;
  delivery_address: string;
  vehicles: any; // Changed from any[] to any to match jsonb type
  total_price_ht: number;
  total_price_ttc: number;
  distance: string;
  status: 'pending' | 'accepted' | 'rejected';
  date_created: string;
  pickup_date: string | null;
  pickup_time: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  pickup_contact: any;
  delivery_contact: any;
};

export type Tables = Database['public']['Tables'];
