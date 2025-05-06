
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
      try {
        // Utilisation de la table unifiée avec gestion explicite des types
        const { data, error } = await safeTable('unified_missions')
          .select('*')
          .eq('status', 'confirmé')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Conversion explicite pour assurer la compatibilité des types
          const missionsData = data.map((mission: any) => {
            const missionRow: MissionRow = {
              id: mission.id,
              client_id: mission.client_id,
              driver_id: mission.driver_id || null,
              admin_id: mission.admin_id || null,
              quote_id: null, // Valeur par défaut pour les champs obligatoires
              mission_type: mission.mission_type as "livraison" | "restitution",
              status: mission.status as any, // Cast vers MissionStatus
              mission_number: mission.mission_number || null,
              quote_number: null,
              pickup_address: mission.pickup_address || '',
              delivery_address: mission.delivery_address || '',
              distance: mission.distance || '',
              price_ht: mission.price_ht || null,
              price_ttc: mission.price_ttc || null,
              vehicle_info: mission.vehicle_info || null,
              pickup_date: mission.pickup_date || null,
              pickup_time: null,
              delivery_date: mission.delivery_date || null,
              delivery_time: null,
              pickup_contact: mission.pickup_contact || null,
              delivery_contact: mission.delivery_contact || null,
              created_at: mission.created_at,
              updated_at: mission.updated_at || null,
              vehicles: null,
              additional_info: mission.additional_info || null
            };
            return missionRow;
          });
          
          setMissions(missionsData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des missions:", error);
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
