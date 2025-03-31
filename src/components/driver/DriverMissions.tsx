import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MissionRow } from "@/types/database";
import { useAuthContext } from "@/context/AuthContext";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const DriverMissions = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  
  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch missions assigned to this driver
        const { data, error } = await extendedSupabase
          .from('missions')
          .select('*')
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching driver missions:', error);
          return;
        }
        
        console.log('Driver missions:', data);
        setMissions(data as MissionRow[]);
      } catch (err) {
        console.error('Error in fetchMissions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissions();
    
    // Set up a real-time subscription for new missions
    if (user) {
      const channel = extendedSupabase
        .channel('driver-missions')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'missions',
          filter: `driver_id=eq.${user.id}`
        }, payload => {
          // Add the new mission to our list
          const newMission = payload.new as MissionRow;
          setMissions(prev => [newMission, ...prev]);
          
          // Create a new notification
          extendedSupabase
            .from('notifications')
            .insert({
              user_id: user.id,
              message: `Nouvelle mission assignée: ${newMission.mission_number}`,
              type: 'mission_status',
              mission_id: newMission.id
            });
        })
        .subscribe();
        
      return () => {
        extendedSupabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleAcceptMission = async (missionId: string) => {
    try {
      setLoading(true);
      const { error } = await extendedSupabase
        .from('missions')
        .update({ status: 'prise_en_charge' })
        .eq('id', missionId);

      if (error) {
        console.error('Error updating mission status:', error);
        return;
      }

      // Update the local state
      setMissions(prev =>
        prev.map(mission =>
          mission.id === missionId ? { ...mission, status: 'prise_en_charge' } : mission
        )
      );
    } catch (err) {
      console.error('Error in handleAcceptMission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectMission = async (missionId: string) => {
    try {
      setLoading(true);
      const { error } = await extendedSupabase
        .from('missions')
        .update({ status: 'annule' })
        .eq('id', missionId);

      if (error) {
        console.error('Error updating mission status:', error);
        return;
      }

      // Update the local state
      setMissions(prev =>
        prev.map(mission =>
          mission.id === missionId ? { ...mission, status: 'annule' } : mission
        )
      );
    } catch (err) {
      console.error('Error in handleRejectMission:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes missions</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="h-8 w-8 text-primary" />
        </div>
      ) : missions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Vous n'avez pas encore de missions assignées</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id} className={mission.status === 'prise_en_charge' ? 'border-l-4 border-l-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{mission.mission_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(mission.created_at || ''), "Pp", { locale: fr })}
                    </p>
                    <p className="mt-2">
                      <span className="block">De: {mission.pickup_address}</span>
                      <span className="block">À: {mission.delivery_address}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleAcceptMission(mission.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Accepter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRejectMission(mission.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Refuser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverMissions;
