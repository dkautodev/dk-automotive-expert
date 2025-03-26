
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
  client_id?: string;
};

export type MissionRow = {
  id: string;
  client_id: string;
  driver_id: string | null;
  quote_id: string | null;
  status: 'en_attente' | 'confirme' | 'prise_en_charge' | 'livre' | 'incident' | 'annule' | 'termine';
  mission_type: 'livraison' | 'restitution';
  mission_number: string | null;
  vehicle_info: any | null;
  pickup_date: string | null;
  pickup_time: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  pickup_contact: any | null;
  delivery_contact: any | null;
  distance: string | null;
  price_ht: number | null;
  price_ttc: number | null;
  created_at: string;
  updated_at: string | null;
  quote?: {
    pickup_address: string;
    delivery_address: string;
  };
};

export type Tables = Database['public']['Tables'];
