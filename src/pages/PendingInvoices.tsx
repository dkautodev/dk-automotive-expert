
import { useEffect, useState } from "react";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PendingInvoices = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const { data, error } = await extendedSupabase
        .from('missions')
        .select('*')
        .eq('status', 'confirmé')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMissions(data as MissionRow[]);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Missions confirmées</h1>
      <div className="space-y-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{mission.mission_number}</p>
                <p className="text-sm text-gray-600">
                  Créé le {format(new Date(mission.created_at || ''), "Pp", { locale: fr })}
                </p>
                <p className="mt-2">
                  De: {mission.pickup_address}
                  <br />
                  À: {mission.delivery_address}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{mission.price_ttc}€ TTC</p>
                <p className="text-sm text-gray-600">{mission.price_ht}€ HT</p>
              </div>
            </div>
          </Card>
        ))}
        {missions.length === 0 && (
          <p className="text-center text-gray-500">Aucune mission confirmée</p>
        )}
      </div>
    </div>
  );
};

export default PendingInvoices;
