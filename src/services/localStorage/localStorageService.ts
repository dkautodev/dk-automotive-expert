
/**
 * Service permettant de stocker et récupérer des données dans le localStorage
 */

/**
 * Enregistre une valeur dans le localStorage
 * @param key - La clé de stockage
 * @param value - La valeur à stocker
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de ${key} dans localStorage:`, error);
  }
};

/**
 * Récupère une valeur depuis le localStorage
 * @param key - La clé de stockage
 * @param defaultValue - Valeur par défaut si rien n'est trouvé
 * @returns La valeur récupérée ou la valeur par défaut
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Supprime une valeur du localStorage
 * @param key - La clé à supprimer
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key} du localStorage:`, error);
  }
};

/**
 * Vérifie si une clé existe dans le localStorage
 * @param key - La clé à vérifier
 * @returns true si la clé existe, false sinon
 */
export const existsInLocalStorage = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

/**
 * Efface toutes les données du localStorage pour l'application
 * @param prefix - Préfixe optionnel pour ne supprimer que certaines clés
 */
export const clearLocalStorage = (prefix?: string): void => {
  try {
    if (prefix) {
      // Supprimer seulement les clés qui commencent par le préfixe
      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => localStorage.removeItem(key));
    } else {
      // Supprimer toutes les clés
      localStorage.clear();
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage du localStorage:', error);
  }
};
