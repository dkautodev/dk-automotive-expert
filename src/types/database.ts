
// Basic mission type without Supabase connection
export interface MissionRow {
  id: string;
  client_id: string;
  driver_id: string | null;
  admin_id: string | null;
  mission_number: string | null;
  status: string;
  pickup_address: string;
  delivery_address: string;
  distance: string;
  price_ht: number | null;
  price_ttc: number | null;
  pickup_date: string | null;
  delivery_date: string | null;
  created_at: string;
  updated_at: string | null;
}
