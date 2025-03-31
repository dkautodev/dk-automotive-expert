
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy", { locale: fr });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function extractPostalCodeAndCity(address: string | undefined) {
  if (!address) return "Non spécifié";
  
  // Recherche du code postal (5 chiffres en France)
  const postalCodeMatch = address.match(/\b\d{5}\b/);
  
  if (!postalCodeMatch) return address.substring(0, 25) + "...";
  
  // Index du code postal
  const postalCodeIndex = address.indexOf(postalCodeMatch[0]);
  
  // Extrait une partie de l'adresse à partir du code postal
  const relevantPart = address.substring(postalCodeIndex);
  
  // Divise en mots pour trouver la ville après le code postal
  const parts = relevantPart.split(' ');
  
  if (parts.length > 1) {
    // Code postal + prochain mot (généralement la ville)
    return `${postalCodeMatch[0]} ${parts.slice(1, 3).join(' ')}`;
  }
  
  // Retourne uniquement le code postal si la ville ne peut pas être extraite
  return postalCodeMatch[0];
}
