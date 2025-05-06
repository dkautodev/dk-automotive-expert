
import { useState, useEffect, useCallback } from "react";
import { MissionRow, UserProfileRow, MissionStatus } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
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
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG] Fetching missions at ${timestamp} with: 
      - refreshTrigger: ${refreshTrigger}
      - showAllMissions: ${showAllMissions}
      - filterStatus: ${Array.isArray(filterStatus) ? filterStatus.join(', ') : filterStatus || 'All'}
      - forceAdminView: ${forceAdminView}
      - isAdmin: ${isAdmin} (${typeof isAdmin})
      - user.email: ${user?.email}
      - role: ${role || 'unknown'}
    `);
    
    try {
      // Build query to get missions
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if showAllMissions is false and filterStatus is provided
      if (!showAllMissions && filterStatus) {
        if (Array.isArray(filterStatus)) {
          console.log(`Filtering by multiple statuses: ${filterStatus.join(', ')}`);
          query = query.in('status', filterStatus);
        } else {
          console.log(`Filtering by single status: ${filterStatus}`);
          query = query.eq('status', filterStatus);
        }
      }
      
      // CORRECTION: Strict check if user is NOT an admin
      if (!isAdmin && user?.id) {
        console.log(`Client mode: Filtering by client_id: ${user.id}`);
        query = query.eq('client_id', user.id);
      } else {
        console.log(`Admin mode: Showing all missions without client_id filter. isAdmin=${isAdmin}`);
        // For admins, we don't apply client_id filter
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
      
      console.log(`Missions retrieved: ${data?.length || 0} at ${timestamp}`);
      
      if (!data || data.length === 0) {
        console.log("No missions found in database");
        return [];
      }
      
      // Transform missions to include properly typed objects
      const transformedMissions = data.map(mission => {
        const vehicleInfo = mission.vehicle_info as any || {};
        
        // Explicit cast of mission_type to the correct type
        const missionType = mission.mission_type === 'livraison' || mission.mission_type === 'restitution' 
          ? mission.mission_type as "livraison" | "restitution"
          : "livraison"; // Default value if not a valid type
        
        // Validate and cast status to MissionStatus type
        const validateStatus = (status: string): MissionStatus => {
          const validStatuses: MissionStatus[] = [
            "termine", "prise_en_charge", "en_attente", "confirme", 
            "confirmé", "livre", "incident", "annule", "annulé"
          ];
          
          return validStatuses.includes(status as MissionStatus) 
            ? status as MissionStatus 
            : "en_attente"; // Default "en_attente" if invalid status
        };
        
        // Make sure structured address data is available
        // Check if properties exist in the mission object
        const missAny = mission as any;
        const hasCityData = missAny.city !== undefined;
        const hasPickupAddress = missAny.pickup_address !== undefined;
        
        // Create a properly typed mission object (without clientProfile for now)
        const typedMission: MissionRow = {
          ...mission,
          mission_type: missionType,
          status: validateStatus(missAny.status),
          pickup_address: hasPickupAddress ? missAny.pickup_address : (vehicleInfo?.pickup_address || 'Not specified'),
          delivery_address: missAny.delivery_address || vehicleInfo?.delivery_address || 'Not specified',
          clientProfile: null, // Will be filled later
          admin_id: missAny.admin_id || null, // Make sure admin_id is properly copied
          // Add structured address properties
          street_number: missAny.street_number || null,
          postal_code: missAny.postal_code || null,
          city: missAny.city || null,
          country: missAny.country || 'France'
        };
        
        // If city and postal_code columns are empty but there's a pickup address,
        // try to extract address components
        if (!typedMission.city && typedMission.pickup_address && typedMission.pickup_address !== 'Not specified') {
          const addressComponents = extractAddressParts(typedMission.pickup_address);
          typedMission.street_number = typedMission.street_number || addressComponents.streetNumber;
          typedMission.postal_code = typedMission.postal_code || addressComponents.postalCode;
          typedMission.city = typedMission.city || addressComponents.city;
          typedMission.country = typedMission.country || addressComponents.country;
        }
        
        return typedMission;
      });
      
      // Get all client profiles in a single query
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
            
            console.log(`Query completed successfully: ${missionsWithProfiles.length} missions with profiles`);
            return missionsWithProfiles;
          }
        }
      }
      
      console.log(`Query completed successfully: ${transformedMissions.length} missions (without profiles)`);
      return transformedMissions;
    } catch (error) {
      console.error("Error in fetchMissions:", error);
      throw error;
    }
  }, [refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user, forceAdminView, role]);

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
    refetchInterval: role === 'admin' ? 90000 : 90000, // 90 sec for all (was 3 sec for admin)
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
