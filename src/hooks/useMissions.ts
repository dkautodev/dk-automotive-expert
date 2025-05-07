
import { useState, useEffect, useCallback } from "react";
import { MissionRow } from "@/types/database";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { extractAddressParts } from "@/utils/addressUtils";

interface UseMissionsProps {
  refreshTrigger?: number;
  showAllMissions?: boolean;
  filterStatus?: string | string[];
  limit?: number;
  forceAdminView?: boolean;
}

// Mock mission data for demonstration
const MOCK_MISSIONS: MissionRow[] = [
  {
    id: 'mock-1',
    created_at: new Date().toISOString(),
    client_id: 'client-1',
    mission_number: 'M2023001',
    status: 'en_attente',
    pickup_address: '123 Rue de Paris, 75001 Paris',
    delivery_address: '456 Avenue des Champs-Élysées, 75008 Paris',
    mission_type: 'livraison',
    distance: '25',
    price_ht: 100,
    price_ttc: 120,
    street_number: '123',
    postal_code: '75001',
    city: 'Paris',
    country: 'France',
    pickup_contact: {
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0123456789',
      email: 'jean@example.com'
    },
    delivery_contact: {
      firstName: 'Marie',
      lastName: 'Martin',
      phone: '0123456789',
      email: 'marie@example.com'
    }
  },
  {
    id: 'mock-2',
    created_at: new Date().toISOString(),
    client_id: 'client-2',
    mission_number: 'M2023002',
    status: 'confirmé',
    pickup_address: '10 Rue de Rivoli, 75004 Paris',
    delivery_address: '20 Boulevard Saint-Germain, 75005 Paris',
    mission_type: 'restitution',
    distance: '5',
    price_ht: 50,
    price_ttc: 60
  }
];

export function useMissions({ 
  refreshTrigger = 0, 
  showAllMissions = false,
  filterStatus,
  limit,
  forceAdminView = false
}: UseMissionsProps = {}) {
  const { user, role } = useAuthContext();
  
  // Improved admin detection
  const adminEmail = 'dkautomotive70@gmail.com';
  const isAdmin = Boolean(forceAdminView || role === 'admin' || (user?.email === adminEmail));
  
  const fetchMissions = useCallback(async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredMissions = [...MOCK_MISSIONS];
      
      // Apply status filter if provided
      if (!showAllMissions && filterStatus) {
        if (Array.isArray(filterStatus)) {
          filteredMissions = filteredMissions.filter(mission => 
            filterStatus.includes(mission.status));
        } else {
          filteredMissions = filteredMissions.filter(mission => 
            mission.status === filterStatus);
        }
      }
      
      // Apply client filter for non-admin users
      if (!isAdmin && user?.id) {
        filteredMissions = filteredMissions.filter(mission => 
          mission.client_id === user.id);
      }
      
      // Apply limit if provided
      if (limit && filteredMissions.length > limit) {
        filteredMissions = filteredMissions.slice(0, limit);
      }
      
      // Sort by created_at descending
      filteredMissions.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Process each mission to ensure full data
      return filteredMissions.map(mission => {
        // Make sure address data is available
        if (!mission.street_number && mission.pickup_address) {
          const addressParts = extractAddressParts(mission.pickup_address);
          return {
            ...mission,
            street_number: mission.street_number || addressParts.streetNumber,
            postal_code: mission.postal_code || addressParts.postalCode,
            city: mission.city || addressParts.city,
            country: mission.country || 'France'
          };
        }
        return mission;
      });
    } catch (error) {
      console.error("Error in fetchMissions:", error);
      throw error;
    }
  }, [refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user]);

  // Use react-query for better cache and state management
  const { 
    data: missions = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['missions', refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user?.id, forceAdminView, role],
    queryFn: fetchMissions,
    staleTime: 0, // Always consider data as stale
    refetchInterval: role === 'admin' ? 90000 : 90000, // 90 sec for all
    retryDelay: 1000, // Wait 1 second between retry attempts
    retry: 3, // Maximum of 3 attempts in case of failure
    meta: {
      onError: (err: any) => {
        console.error('Error in useMissions hook:', err);
        toast.error("Error retrieving missions");
      }
    }
  });

  return { missions, loading, error, refetch };
}
