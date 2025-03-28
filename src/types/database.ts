
import { Database } from "@/integrations/supabase/types";

export type MissionRow = {
  id: string;
  client_id: string;
  driver_id: string | null;
  quote_id: string | null;
  status: 'en_attente' | 'confirme' | 'confirmé' | 'prise_en_charge' | 'livre' | 'incident' | 'annule' | 'termine';
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
  pickup_address: string;
  delivery_address: string;
  vehicles: any | null;
  quote_number: string | null;
};

export type Tables = Database['public']['Tables'];
