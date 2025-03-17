import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Truck, Receipt, History, Settings, ArrowLeft } from 'lucide-react';
const ClientSidebar = () => {
  return <div className="h-screen w-52 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-2 my-[25px]">
        <img alt="DK Automotive" className="w-36 h-auto mx-auto mb-2" src="/lovable-uploads/15aa1e07-0fa4-487b-b0c1-3c631f4385b6.png" />
        
      </div>
      
      <nav className="mt-4">
        <ul>
          <li className="mb-2">
            <Link to="/dashboard/client" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/client/pending-quotes" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <FileText className="mr-2 h-4 w-4" />
              Devis en Attente
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/client/ongoing-shipments" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Truck className="mr-2 h-4 w-4" />
              Convoyages en Cours
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/client/completed-shipments" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <History className="mr-2 h-4 w-4" />
              Historique
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/client/pending-invoices" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Receipt className="mr-2 h-4 w-4" />
              Factures en Attente
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/client/profile" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Settings className="mr-2 h-4 w-4" />
              Mon Profil
            </Link>
          </li>
        </ul>
      </nav>
    </div>;
};
export default ClientSidebar;