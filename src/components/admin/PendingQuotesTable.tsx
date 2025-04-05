
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MissionsTable } from "./missions/MissionsTable";
import { MissionsTableSkeleton } from "./missions/MissionsTableSkeleton";
import { EmptyMissionsState } from "./missions/EmptyMissionsState";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";

interface PendingQuotesTableProps {
  refreshTrigger?: number;
}

const PendingQuotesTable = ({ refreshTrigger = 0 }: PendingQuotesTableProps) => {
  const { missions, loading } = usePendingQuotes(refreshTrigger);

  const handleMissionCancelled = () => {
    // This will trigger a refresh in the parent component
    console.log("Mission cancelled, refreshing table...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devis en attente</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <MissionsTableSkeleton />
        ) : missions.length > 0 ? (
          <MissionsTable 
            missions={missions} 
            onMissionCancelled={handleMissionCancelled} 
          />
        ) : (
          <EmptyMissionsState message="Aucun devis en attente" />
        )}
      </CardContent>
    </Card>
  );
};

// Custom hook to fetch only pending quotes
function usePendingQuotes(refreshTrigger = 0) {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingQuotes = async () => {
      try {
        setLoading(true);
        console.log("Fetching pending quotes with refreshTrigger:", refreshTrigger);
        
        const { data, error } = await supabase
          .from('missions')
          .select(`
            *,
            clientProfile:client_id(*)
          `)
          .eq('status', 'en_attente')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching pending quotes:", error);
          throw error;
        }

        console.log("Pending quotes fetched:", data);
        
        const transformedMissions = data.map(mission => {
          const vehicleInfo = mission.vehicle_info as any || {};
          
          return {
            ...mission,
            pickup_address: vehicleInfo?.pickup_address || 'Non spécifié',
            delivery_address: vehicleInfo?.delivery_address || 'Non spécifié',
          };
        });
        
        setMissions(transformedMissions);
      } catch (error) {
        console.error("Error in usePendingQuotes:", error);
        toast.error("Erreur lors de la récupération des devis en attente");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingQuotes();
  }, [refreshTrigger]);

  return { missions, loading };
}

export default PendingQuotesTable;
