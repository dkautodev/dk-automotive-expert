
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";

interface UseTodayMissionsOptions {
  userId?: string;
  userRole?: string;
}

export const useTodayMissions = ({ userId, userRole }: UseTodayMissionsOptions = {}) => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('missions')
          .select('*');

        // Filter based on user role
        if (userRole === 'client') {
          query = query.eq('client_id', userId);
        } else if (userRole === 'chauffeur') {
          query = query.eq('driver_id', userId);
        }

        // Get today's missions
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('pickup_date', today);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        if (!data) {
          setMissions([]);
          return;
        }

        // Type conversion and adding needed fields if they don't exist
        const typedData: MissionRow[] = data.map(item => ({
          ...item as any,
          pickup_address: (item as any).pickup_address || "",
          delivery_address: (item as any).delivery_address || "",
        }));

        setMissions(typedData);
      } catch (err: any) {
        console.error('Error fetching today missions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [userId, userRole]);

  return { missions, loading, error };
};
