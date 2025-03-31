import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PieChart, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import NotificationBell from "../notifications/NotificationBell";

const AdminSidebar = () => {
  const { signOut } = useAuthContext();
  const { collapsed, toggleCollapsed } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-52 bg-white border-r border-gray-200 z-10">
      <div className="h-16 flex items-center justify-between px-4">
        <Link to="/dashboard/admin" className="font-semibold">
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
      
      <nav className="mt-4 flex-1">
        <ul>
          <li className="mb-2">
            <Link to="/dashboard/admin" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/admin/pricing-grids" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <PieChart className="mr-2 h-4 w-4" />
              Grilles tarifaires
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
