
import { useEffect, useState } from "react";
import { safeTable } from "@/utils/supabase-helper";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PendingInvoices = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      // Utilisation de la table unifiée
      const { data, error } = await safeTable('unified_missions')
        .select('*')
        .eq('status', 'confirmé')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Conversion explicite pour assurer la compatibilité des types
        const missionsData = data.map((mission: any) => {
          const missionRow: MissionRow = {
            ...mission,
            // Ajout des propriétés requises qui pourraient manquer
            quote_id: mission.quote_id || null,
            quote_number: mission.quote_number || null,
            pickup_time: mission.pickup_time || null,
            delivery_time: mission.delivery_time || null,
            vehicles: mission.vehicles || null
          };
          return missionRow;
        });
        
        setMissions(missionsData);
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
