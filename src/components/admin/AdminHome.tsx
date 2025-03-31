
import DashboardCards from "./DashboardCards";
import CompletedMissionsTable from "./CompletedMissionsTable";
import PendingInvoicesTable from "./PendingInvoicesTable";
import RevenueStatistics from "./RevenueStatistics";

const AdminHome = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord administrateur</p>
      </div>

      <DashboardCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueStatistics />
        <CompletedMissionsTable />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <PendingInvoicesTable />
      </div>
    </div>
  );
};

export default AdminHome;
