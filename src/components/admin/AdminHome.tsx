
import { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import ClientManagement from "./ClientManagement";
import PendingInvoicesTable from "./PendingInvoicesTable";
import CompletedMissionsTable from "./CompletedMissionsTable";
import OngoingMissionsTable from "./OngoingMissionsTable";
import PendingQuotesTable from "./PendingQuotesTable";
import CreateMissionDialog from "../mission-form/CreateMissionDialog";
import { toast } from "sonner";

const AdminHome = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effet pour forcer l'actualisation lors du chargement initial
  useEffect(() => {
    console.log("AdminHome initial load, setting refresh trigger to 1");
    setRefreshTrigger(1);
  }, []);

  const handleMissionCreated = () => {
    // Incrémente le déclencheur de rafraîchissement pour forcer la mise à jour des tables
    const newValue = refreshTrigger + 1;
    setRefreshTrigger(newValue);
    console.log("Mission créée, rafraîchissement du tableau de bord avec valeur:", newValue);
    toast.success("Mission créée avec succès! Le tableau de bord est mis à jour.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <CreateMissionDialog onMissionCreated={handleMissionCreated} />
      </div>
      
      <DashboardCards refreshTrigger={refreshTrigger} />
      
      <div className="grid grid-cols-1 gap-6">
        <PendingQuotesTable refreshTrigger={refreshTrigger} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <OngoingMissionsTable refreshTrigger={refreshTrigger} showAllMissions={false} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletedMissionsTable refreshTrigger={refreshTrigger} />
        <PendingInvoicesTable refreshTrigger={refreshTrigger} />
      </div>
      
      <ClientManagement />
    </div>
  );
};

export default AdminHome;
