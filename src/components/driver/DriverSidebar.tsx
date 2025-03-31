import { 
  ChevronLeft, 
  LayoutDashboard, 
  FileText, 
  User,
  Truck,
  CreditCard,
  LogOut,
  FileCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

interface DriverSidebarProps {}

const DriverSidebar: React.FC<DriverSidebarProps> = () => {
  const navigate = useNavigate();
  const { collapsed, toggleCollapsed } = useSidebar();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="fixed inset-y-0 left-0 w-52 bg-white border-r border-gray-200 z-10">
      <div className="h-16 flex items-center justify-between px-4">
        <Link to="/dashboard/driver" className="font-semibold">
          DK Automotive
        </Link>
        <div className="flex items-center space-x-1">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="h-8 w-8"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>
      
      <Separator />

      <div className="flex flex-col space-y-1 p-2">
        <Link
          to="/dashboard/driver"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>
        <Link
          to="/dashboard/driver/missions"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        >
          <Truck className="h-4 w-4" />
          <span>Mes missions</span>
        </Link>
        <Link
          to="/dashboard/driver/documents"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        >
          <FileCheck className="h-4 w-4" />
          <span>Mes documents</span>
        </Link>
        {/* <Link
          to="/dashboard/driver/factures"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        >
          <CreditCard className="h-4 w-4" />
          <span>Mes factures</span>
        </Link> */}
        <Link
          to="/dashboard/driver/profile"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
        >
          <User className="h-4 w-4" />
          <span>Mon profil</span>
        </Link>
      </div>

      <Separator />

      <div className="flex flex-col space-y-1 p-2">
        <Button
          variant="ghost"
          className="justify-start rounded-md p-2 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Se déconnecter</span>
        </Button>
      </div>
    </div>
  );
};

export default DriverSidebar;
