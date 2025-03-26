
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PieChart } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <div className="h-screen w-52 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-2 my-[25px]">
        <img alt="DK Automotive" className="w-36 h-auto mx-auto mb-2" src="/lovable-uploads/15aa1e07-0fa4-487b-b0c1-3c631f4385b6.png" />
      </div>
      
      <nav className="mt-4">
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
    </div>
  );
};

export default AdminSidebar;
