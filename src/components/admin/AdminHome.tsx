
import React, { useState, useEffect } from "react";
import DashboardCards from "./DashboardCards";
import CompletedMissionsTable from "./CompletedMissionsTable";
import PendingInvoicesTable from "./PendingInvoicesTable";
import RevenueStatistics from "./RevenueStatistics";
import { supabase } from "@/integrations/supabase/client";

const AdminHome = () => {
  const [completedMissions, setCompletedMissions] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  
  useEffect(() => {
    // Fetch completed missions
    const fetchCompletedMissions = async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'livre')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!error && data) {
        setCompletedMissions(data);
      }
    };
    
    // Fetch pending invoices
    const fetchPendingInvoices = async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'livre')
        .is('payment_status', null)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setPendingInvoices(data);
      }
    };
    
    fetchCompletedMissions();
    fetchPendingInvoices();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord administrateur</p>
      </div>

      <DashboardCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueStatistics />
        <CompletedMissionsTable missions={completedMissions} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <PendingInvoicesTable missions={pendingInvoices} />
      </div>
    </div>
  );
};

export default AdminHome;
