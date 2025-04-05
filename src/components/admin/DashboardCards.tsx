
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { toast } from "sonner";
import { Circle, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface DashboardCardsProps {
  refreshTrigger?: number;
}

const DashboardCards = ({ refreshTrigger = 0 }: DashboardCardsProps) => {
  const [pendingQuotesCount, setPendingQuotesCount] = useState(0);
  const [ongoingMissionsCount, setOngoingMissionsCount] = useState(0);
  const [completedMissionsCount, setCompletedMissionsCount] = useState(0);
  const [totalMissionsCount, setTotalMissionsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log("DashboardCards: Fetching counts with refreshTrigger:", refreshTrigger);
        
        // Fetch total missions count
        const { count: totalCount, error: totalError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) {
          console.error("Error fetching total missions:", totalError);
          throw totalError;
        }
        
        // Fetch pending quotes count - status 'en_attente'
        const { count: pendingCount, error: pendingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'en_attente');
        
        if (pendingError) {
          console.error("Error fetching pending quotes:", pendingError);
          throw pendingError;
        }
        
        // Fetch ongoing missions count - statuses 'confirmé', 'confirme' or 'prise_en_charge'
        const { count: ongoingCount, error: ongoingError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['confirmé', 'confirme', 'prise_en_charge']);
        
        if (ongoingError) {
          console.error("Error fetching ongoing missions:", ongoingError);
          throw ongoingError;
        }
        
        // Fetch completed missions count - statuses 'termine' or 'livre'
        const { count: completedCount, error: completedError } = await extendedSupabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['termine', 'livre']);
        
        if (completedError) {
          console.error("Error fetching completed missions:", completedError);
          throw completedError;
        }
        
        console.log("Mission counts:", {
          total: totalCount,
          pending: pendingCount,
          ongoing: ongoingCount,
          completed: completedCount
        });
        
        setTotalMissionsCount(totalCount || 0);
        setPendingQuotesCount(pendingCount || 0);
        setOngoingMissionsCount(ongoingCount || 0);
        setCompletedMissionsCount(completedCount || 0);
      } catch (error: any) {
        console.error('Error fetching dashboard counts:', error);
        toast.error(`Erreur: ${error.message}`);
      }
    };

    fetchCounts();
  }, [refreshTrigger]);

  return (
    <div className="grid gap-6 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total des missions</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalMissionsCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Devis en attente</CardTitle>
          <Circle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingQuotesCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Missions en cours</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{ongoingMissionsCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedMissionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
