
import { useState, useEffect, useCallback } from "react";
import { MissionRow, UserProfileRow, MissionStatus } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { extractAddressComponents } from "@/utils/addressUtils";

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
  
  // Amélioration de la détection des administrateurs
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
      // Construction de la requête pour récupérer les missions
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Application du filtre de statut si showAllMissions est false et filterStatus est fourni
      if (!showAllMissions && filterStatus) {
        if (Array.isArray(filterStatus)) {
          console.log(`Filtering by multiple statuses: ${filterStatus.join(', ')}`);
          query = query.in('status', filterStatus);
        } else {
          console.log(`Filtering by single status: ${filterStatus}`);
          query = query.eq('status', filterStatus);
        }
      }
      
      // CORRECTION: Vérification stricte si l'utilisateur n'est PAS un admin
      if (!isAdmin && user?.id) {
        console.log(`Mode client: Filtering by client_id: ${user.id}`);
        query = query.eq('client_id', user.id);
      } else {
        console.log(`Mode admin: Affichage de toutes les missions sans filtre client_id. isAdmin=${isAdmin}`);
        // Pour les admins, nous n'appliquons pas de filtre client_id
      }

      // Application de la limite si fournie
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
      
      // Transformation des missions pour inclure des objets correctement typés
      const transformedMissions = data.map(mission => {
        const vehicleInfo = mission.vehicle_info as any || {};
        
        // Cast explicite de mission_type au type correct
        const missionType = mission.mission_type === 'livraison' || mission.mission_type === 'restitution' 
          ? mission.mission_type as "livraison" | "restitution"
          : "livraison"; // Valeur par défaut si ce n'est pas un type valide
        
        // Validation et cast du statut au type MissionStatus
        const validateStatus = (status: string): MissionStatus => {
          const validStatuses: MissionStatus[] = [
            "termine", "prise_en_charge", "en_attente", "confirme", 
            "confirmé", "livre", "incident", "annule", "annulé"
          ];
          
          return validStatuses.includes(status as MissionStatus) 
            ? status as MissionStatus 
            : "en_attente"; // Par défaut "en_attente" si statut invalide
        };
        
        // S'assurer que les données d'adresse structurée sont disponibles
        // Vérifier si les propriétés existent dans l'objet mission
        const missAny = mission as any;
        const hasCityData = missAny.city !== undefined;
        const hasPickupAddress = missAny.pickup_address !== undefined;
        
        // Création d'un objet mission correctement typé (sans clientProfile pour l'instant)
        const typedMission: MissionRow = {
          ...mission,
          mission_type: missionType,
          status: validateStatus(missAny.status),
          pickup_address: hasPickupAddress ? missAny.pickup_address : (vehicleInfo?.pickup_address || 'Non spécifié'),
          delivery_address: missAny.delivery_address || vehicleInfo?.delivery_address || 'Non spécifié',
          clientProfile: null, // Sera rempli plus tard
          admin_id: missAny.admin_id || null, // S'assurer que admin_id est correctement copié
          // Ajouter les propriétés d'adresse structurée
          street_number: missAny.street_number || null,
          postal_code: missAny.postal_code || null,
          city: missAny.city || null,
          country: missAny.country || 'France'
        };
        
        // Si les colonnes city et postal_code sont vides, mais qu'il y a une adresse de pickup,
        // essayer d'extraire les composantes de l'adresse
        if (!typedMission.city && typedMission.pickup_address && typedMission.pickup_address !== 'Non spécifié') {
          const addressComponents = extractAddressComponents(typedMission.pickup_address);
          typedMission.street_number = typedMission.street_number || addressComponents.streetNumber;
          typedMission.postal_code = typedMission.postal_code || addressComponents.postalCode;
          typedMission.city = typedMission.city || addressComponents.city;
          typedMission.country = typedMission.country || addressComponents.country;
        }
        
        return typedMission;
      });
      
      // Récupération de tous les profils clients en une seule requête
      if (transformedMissions.length > 0) {
        // Extraction des ID clients uniques
        const clientIds = [...new Set(transformedMissions.map(m => m.client_id))].filter(Boolean);
        
        if (clientIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', clientIds);
            
          if (profilesError) {
            console.error("Error fetching client profiles:", profilesError);
            // Continuer sans profils plutôt que d'échouer complètement
          } else if (profiles) {
            // Attachement des profils aux missions respectives
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

  // Utilisation de react-query pour une meilleure gestion du cache et de l'état
  const { 
    data: missions = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['missions', refreshTrigger, showAllMissions, filterStatus, limit, isAdmin, user?.id, forceAdminView, role],
    queryFn: fetchMissions,
    staleTime: 0, // Toujours considérer les données comme obsolètes
    refetchInterval: role === 'admin' ? 3000 : 90000, // 3 sec pour admin, 90 sec pour client/chauffeur
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
