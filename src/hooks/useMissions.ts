
import { useState, useEffect, useCallback } from "react";
import { MissionRow, UserProfileRow, MissionStatus } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";

interface UseMissionsProps {
  refreshTrigger?: number;
  showAllMissions?: boolean;
  filterStatus?: string | string[];
  limit?: number;
  forceAdminView?: boolean;
}

export function useMissions({ 
  refreshTrigger = 0, 
  showAllMissions = false,
  filterStatus,
  limit,
  forceAdminView = false
}: UseMissionsProps = {}) {
  const { user, role } = useAuthContext();
  
  // Déterminez explicitement le statut admin en utilisant plusieurs critères
  // 1. Si forceAdminView est true
  // 2. Si l'utilisateur a le rôle 'admin'
  // 3. Si l'email de l'utilisateur est l'email admin spécifique
  const adminEmail = 'dkautomotive70@gmail.com';
  const isAdmin = forceAdminView || role === 'admin' || (user?.email === adminEmail);
  
  const fetchMissions = useCallback(async () => {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG] Fetching missions at ${timestamp} with: 
      - refreshTrigger: ${refreshTrigger}
      - showAllMissions: ${showAllMissions}
      - filterStatus: ${Array.isArray(filterStatus) ? filterStatus.join(', ') : filterStatus}
      - forceAdminView: ${forceAdminView}
      - isAdmin: ${isAdmin}
      - user.email: ${user?.email}
      - role: ${role}
    `);
    
    try {
      // Start building the query to fetch missions
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter only if showAllMissions is false and filterStatus is provided
      if (!showAllMissions && filterStatus) {
        if (Array.isArray(filterStatus)) {
          console.log(`Filtering by multiple statuses: ${filterStatus.join(', ')}`);
          query = query.in('status', filterStatus);
        } else {
          console.log(`Filtering by single status: ${filterStatus}`);
          query = query.eq('status', filterStatus);
        }
      }
      
      // IMPORTANT: Nous sommes en mode admin, NE PAS filtrer par client_id
      if (!isAdmin && user?.id) {
        console.log(`Mode client: Filtering by client_id: ${user.id}`);
        query = query.eq('client_id', user.id);
      } else {
        console.log(`Mode admin: Affichage de toutes les missions sans filtre client_id`);
        // Dans le mode admin, nous ne filtrons pas par client_id pour voir toutes les missions
      }

      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching missions:", error);
        throw error;
      }
      
      console.log(`Missions récupérées: ${data?.length || 0} à ${timestamp}`);
      
      if (!data || data.length === 0) {
        console.log("Aucune mission trouvée dans la base de données");
        return [];
      }
      
      // Transform missions to include properly typed objects
      const transformedMissions = data.map(mission => {
        const vehicleInfo = mission.vehicle_info as any || {};
        
        // Explicitly cast mission_type to the correct type
        const missionType = mission.mission_type === 'livraison' || mission.mission_type === 'restitution' 
          ? mission.mission_type as "livraison" | "restitution"
          : "livraison"; // Default value if not a valid type
        
        // Validate and cast the status to MissionStatus type
        const validateStatus = (status: string): MissionStatus => {
          const validStatuses: MissionStatus[] = [
            "termine", "prise_en_charge", "en_attente", "confirme", 
            "confirmé", "livre", "incident", "annule", "annulé"
          ];
          
          return validStatuses.includes(status as MissionStatus) 
            ? status as MissionStatus 
            : "en_attente"; // Default to "en_attente" if invalid status
        };
        
        // Create a properly typed mission object (without clientProfile for now)
        const typedMission: MissionRow = {
          ...mission,
          mission_type: missionType,
          status: validateStatus(mission.status),
          pickup_address: vehicleInfo?.pickup_address || 'Non spécifié',
          delivery_address: vehicleInfo?.delivery_address || 'Non spécifié',
          clientProfile: null // Will be populated later
        };
        
        return typedMission;
      });
      
      // Now fetch all client profiles in a single query
      if (transformedMissions.length > 0) {
        // Extract unique client IDs
        const clientIds = [...new Set(transformedMissions.map(m => m.client_id))].filter(Boolean);
        
        if (clientIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', clientIds);
            
          if (profilesError) {
            console.error("Error fetching client profiles:", profilesError);
            // Continue without profiles rather than failing completely
          } else if (profiles) {
            // Attach profiles to respective missions
            const missionsWithProfiles = transformedMissions.map(mission => {
              const clientProfile = profiles.find(
                profile => profile.user_id === mission.client_id
              ) || null;
              
              return {
                ...mission,
                clientProfile
              };
            });
            
            console.log(`Requête terminée avec succès: ${missionsWithProfiles.length} missions avec profiles`);
            return missionsWithProfiles;
          }
        }
      }
      
      console.log(`Requête terminée avec succès: ${transformedMissions.length} missions (sans profiles)`);
      return transformedMissions;
    } catch (error) {
      console.error("Error in fetchMissions:", error);
      throw error;
    }
  }, [refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user, forceAdminView, role]);

  // Use react-query for better caching and state management with improved refresh settings
  const { 
    data: missions = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['missions', refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user?.id, forceAdminView, role, Date.now()],
    queryFn: fetchMissions,
    staleTime: 0, // Toujours considérer les données comme obsolètes
    refetchInterval: 3000, // Rafraîchissement automatique toutes les 3 secondes
    retryDelay: 1000, // Attendre 1 seconde entre les tentatives
    retry: 3, // Maximum de 3 tentatives en cas d'échec
    meta: {
      onError: (err: any) => {
        console.error('Error in useMissions hook:', err);
        toast.error("Erreur lors de la récupération des missions");
      }
    }
  });

  return { missions, loading, error, refetch };
}
