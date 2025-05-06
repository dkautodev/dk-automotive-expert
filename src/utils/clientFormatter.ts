
import { MissionRow } from "@/types/database";

/**
 * Fonction utilitaire qui standardise l'affichage du nom du client
 * en suivant une hiérarchie de priorité cohérente :
 * 1. Code client (s'il existe)
 * 2. Nom de la société (s'il existe)
 * 3. Prénom et nom
 * 4. Valeur par défaut
 */
export function formatClientName(profile: any | null, defaultValue: string = 'Client inconnu'): string {
  if (!profile) return defaultValue;
  
  // Priorité 1: Code client
  if (profile.client_code && profile.client_code.trim() !== "") {
    return profile.client_code;
  }
  
  // Priorité 2: Nom de la société
  if (profile.company_name && profile.company_name.trim() !== "") {
    return profile.company_name;
  }
  
  // Priorité 3: Prénom et nom
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  if (fullName) {
    return fullName;
  }
  
  // Valeur par défaut
  return defaultValue;
}

/**
 * Fonction qui extrait le profil client d'une mission et renvoie son nom formaté
 */
export function formatMissionClientName(mission: MissionRow, defaultValue: string = 'Client inconnu'): string {
  return formatClientName(mission.clientProfile, defaultValue);
}
