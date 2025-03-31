
import { useState } from "react";
import DashboardCards from "./DashboardCards";
import ClientManagement from "./ClientManagement";
import PendingInvoicesTable from "./PendingInvoicesTable";
import CompletedMissionsTable from "./CompletedMissionsTable";
import OngoingMissionsTable from "./OngoingMissionsTable";
import CreateMissionDialog from "../mission-form/CreateMissionDialog";

const AdminHome = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMissionCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <CreateMissionDialog onMissionCreated={handleMissionCreated} />
      </div>
      
      <DashboardCards refreshTrigger={refreshTrigger} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OngoingMissionsTable refreshTrigger={refreshTrigger} />
        <CompletedMissionsTable refreshTrigger={refreshTrigger} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <OngoingMissionsTable refreshTrigger={refreshTrigger} showAllMissions={true} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingInvoicesTable refreshTrigger={refreshTrigger} />
      </div>
      
      <ClientManagement />
    </div>
  );
};

export default AdminHome;
