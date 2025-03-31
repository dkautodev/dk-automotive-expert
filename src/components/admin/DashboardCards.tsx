
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
        // Fetch pending quotes count
        const { count: pendingCount, error: pendingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'devis');
        
        if (pendingError) throw pendingError;
        
        // Fetch ongoing missions count - Include both 'confirmé' and 'confirme' statuses
        const { count: ongoingCount, error: ongoingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['confirmé', 'confirme', 'prise_en_charge']);
        
        if (ongoingError) throw ongoingError;
        
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
