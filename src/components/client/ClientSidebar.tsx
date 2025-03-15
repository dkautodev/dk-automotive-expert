import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Car, Settings } from 'lucide-react';

const ClientSidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <img 
          src="/dk-automotive-logo.png" 
          alt="DK Automotive" 
          className="w-full h-auto mb-2"
        />
        <p className="text-center text-sm text-gray-600">Convoyage | Livraisons | Restitutions</p>
      </div>
      
      <nav className="mt-6">
        <ul>
          <li className="mb-2">
            <Link to="/client/dashboard" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/client/new-quote" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Devis
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/client/quotes" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Car className="mr-2 h-4 w-4" />
              Mes Devis
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/client/profile" className="flex items-center p-3 hover:bg-gray-100 rounded-md">
              <Settings className="mr-2 h-4 w-4" />
              Mon Profil
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ClientSidebar;
