
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PieChart, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminSidebar = () => {
  const { signOut } = useAuthContext();

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
    <div className="h-screen w-52 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-2 my-[25px]">
        <img alt="DK Automotive" className="w-36 h-auto mx-auto mb-2" src="/lovable-uploads/15aa1e07-0fa4-487b-b0c1-3c631f4385b6.png" />
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
