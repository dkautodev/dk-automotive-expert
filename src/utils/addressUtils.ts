
/**
 * Extrait le code postal et la ville d'une adresse complète
 * @param address Adresse complète
 * @returns Code postal et ville ou extrait de l'adresse
 */
export const extractPostalCodeAndCity = (address: string | undefined) => {
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
};
