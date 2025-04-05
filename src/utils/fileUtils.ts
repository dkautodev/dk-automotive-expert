
/**
 * Utility functions for file handling
 */

/**
 * Vérifie si le type de fichier est autorisé
 */
export const isFileTypeAllowed = (fileType: string, allowedTypes?: string[]): boolean => {
  // Liste des types MIME autorisés par défaut
  const defaultAllowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    // Documents
    'application/pdf', 
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/plain', // .txt
    'text/csv' // .csv
  ];
  
  const typesToCheck = allowedTypes || defaultAllowedTypes;
  return typesToCheck.includes(fileType);
};

/**
 * Génère un nom de fichier unique
 */
export const generateUniqueFileName = (fileIndex: number, originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || '';
  const paddedIndex = fileIndex.toString().padStart(2, '0');
  
  return `fichier${paddedIndex}_${timestamp}_${randomString}${extension ? `.${extension}` : ''}`;
};

/**
 * Formate la taille du fichier en unités lisibles (KB, MB, etc.)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};
