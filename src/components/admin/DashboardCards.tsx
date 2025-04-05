
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { toast } from "sonner";

interface DashboardCardsProps {
  pendingQuotesCount?: number;
  ongoingMissionsCount?: number;
  refreshTrigger?: number;
}

const DashboardCards = ({ 
  pendingQuotesCount: initialPendingCount = 0, 
  ongoingMissionsCount: initialOngoingCount = 0,
  refreshTrigger = 0
}: DashboardCardsProps) => {
  const [pendingQuotesCount, setPendingQuotesCount] = useState(initialPendingCount);
  const [ongoingMissionsCount, setOngoingMissionsCount] = useState(initialOngoingCount);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log("DashboardCards: Fetching counts with refreshTrigger:", refreshTrigger);
        
        // Fetch pending quotes count - status 'en_attente'
        const { count: pendingCount, error: pendingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'en_attente');
        
        if (pendingError) {
          console.error("Error fetching pending quotes:", pendingError);
          throw pendingError;
        }
        
        console.log("Pending quotes count:", pendingCount);
        
        // Fetch ongoing missions count - statuses 'confirmé', 'confirme' or 'prise_en_charge'
        const { count: ongoingCount, error: ongoingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['confirmé', 'confirme', 'prise_en_charge']);
        
        if (ongoingError) {
          console.error("Error fetching ongoing missions:", ongoingError);
          throw ongoingError;
        }
        
        console.log("Ongoing missions count:", ongoingCount);
        
        setPendingQuotesCount(pendingCount || 0);
        setOngoingMissionsCount(ongoingCount || 0);
      } catch (error: any) {
        console.error('Error fetching dashboard counts:', error);
        toast.error(`Erreur: ${error.message}`);
      }
    };

    fetchCounts();
  }, [refreshTrigger]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Devis en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingQuotesCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Missions en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{ongoingMissionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
