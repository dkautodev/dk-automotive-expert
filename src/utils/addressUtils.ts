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

/**
 * Extraire les composantes d'adresse à partir d'une adresse complète
 * @param address Adresse complète
 * @returns Un objet contenant les composantes de l'adresse
 */
export const extractAddressComponents = (address: string) => {
  // Si l'adresse est vide ou indéfinie
  if (!address) return {
    streetNumber: '',
    postalCode: '',
    city: '',
    country: 'France' // Par défaut
  };

  try {
    // Essayer d'extraire le code postal et la ville
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
    
    // Extraire la ville - généralement après le code postal
    let city = '';
    if (postalCodeMatch && postalCodeMatch.index !== undefined) {
      const afterPostalCode = address.substring(postalCodeMatch.index + 5).trim();
      // La ville est généralement le premier mot après le code postal
      const cityMatch = afterPostalCode.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+/);
      city = cityMatch ? cityMatch[0].trim() : '';
    }

    // Extraire le numéro et la rue - généralement avant le code postal
    let streetNumber = '';
    if (postalCodeMatch && postalCodeMatch.index !== undefined) {
      streetNumber = address.substring(0, postalCodeMatch.index).trim();
    } else {
      // Si pas de code postal, utiliser toute l'adresse comme numéro de rue
      streetNumber = address;
    }

    return {
      streetNumber,
      postalCode,
      city,
      country: 'France' // Par défaut pour les adresses françaises
    };
  } catch (error) {
    console.error("Erreur lors de l'extraction des composantes d'adresse:", error);
    return {
      streetNumber: address, // Utiliser l'adresse complète comme numéro de rue par défaut
      postalCode: '',
      city: '',
      country: 'France'
    };
  }
};
