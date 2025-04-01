
import { ChevronLeft, LayoutDashboard, FileText, User, ClipboardList, LogOut, X, History, BookOpen } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar, Sidebar } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ClientSidebar = () => {
  const { collapsed, toggleCollapsed } = useSidebar();
  const { signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Si on est sur mobile, utiliser le composant Sidebar qui s'adaptera
  if (isMobile) {
    return (
      <Sidebar className="fixed left-0 top-0 z-50 pt-16 h-screen bg-white">
        <div className="flex flex-col h-full">
          <div className="flex justify-end px-4">
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col space-y-1 p-2">
            <Link to="/dashboard/client" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Tableau de bord</span>
            </Link>
            <Link to="/dashboard/client/profile" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/profile") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <User className="h-4 w-4" />
              <span>Profil</span>
            </Link>
            <Link to="/dashboard/client/address-book" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/address-book") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <BookOpen className="h-4 w-4" />
              <span>Carnet d'adresses</span>
            </Link>
            <Link to="/dashboard/client/pending-quotes" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/pending-quotes") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <FileText className="h-4 w-4" />
              <span>Devis en attente</span>
            </Link>
            <Link to="/dashboard/client/ongoing-shipments" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/ongoing-shipments") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <ClipboardList className="h-4 w-4" />
              <span>Missions en cours</span>
            </Link>
            <Link to="/dashboard/client/completed-shipments" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/completed-shipments") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <ClipboardList className="h-4 w-4" />
              <span>Missions terminées</span>
            </Link>
            <Link to="/dashboard/client/mission-history" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/mission-history") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")} onClick={() => isMobile && toggleCollapsed()}>
              <History className="h-4 w-4" />
              <span>Historique des missions</span>
            </Link>
          </div>

          <div className="mt-auto p-2">
            <Button variant="ghost" className="w-full justify-start font-normal" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 w-52 bg-white border-r border-gray-200 z-10">
      <div className="h-16 flex items-center justify-between px-4">
        <Link to="/dashboard/client" className="font-semibold">
          DK Automotive
        </Link>
        <div className="flex items-center space-x-1">
          <NotificationBell />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col space-y-1 p-2">
        <Link to="/dashboard/client" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client") && location.pathname === "/dashboard/client" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>
        <Link to="/dashboard/client/profile" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/profile") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}>
          <User className="h-4 w-4" />
          <span>Profil</span>
        </Link>
        <Link to="/dashboard/client/address-book" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/address-book") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}>
          <BookOpen className="h-4 w-4" />
          <span>Carnet d'adresses</span>
        </Link>
        <Link to="/dashboard/client/mission-history" className={cn("flex items-center space-x-2 px-3 py-2 rounded-md transition-colors", isActive("/dashboard/client/mission-history") ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}>
          <History className="h-4 w-4" />
          <span>Historique des missions</span>
        </Link>
      </div>
      
      <div className="p-2">
        <Button variant="ghost" className="w-full justify-start font-normal" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};

export default ClientSidebar;
