
import { useAuthContext } from "@/context/AuthContext";
import { useOngoingMissions } from "@/hooks/useOngoingMissions";
import { ShipmentsHeader } from "@/components/client/shipments/ShipmentsHeader";
import { OngoingShipmentsTable } from "@/components/client/shipments/OngoingShipmentsTable";
import { ShipmentsLoader } from "@/components/client/shipments/ShipmentsLoader";

const OngoingShipments = () => {
  const { user } = useAuthContext();
  const { missions, loading, refreshMissions } = useOngoingMissions(user?.id);

  if (loading) {
    return <ShipmentsLoader />;
  }

  return (
    <div className="p-6">
      <ShipmentsHeader title="Convoyages en cours" />
      <OngoingShipmentsTable 
        missions={missions} 
        onRefresh={refreshMissions} 
      />
    </div>
  );
};

export default OngoingShipments;
