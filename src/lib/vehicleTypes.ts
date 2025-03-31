
export const vehicleTypes = [
  { id: "citadine", name: "Citadine" },
  { id: "berline", name: "Berline" },
  { id: "suv", name: "4x4 (ou SUV)" },
  { id: "utilitaire-3-5", name: "Utilitaire 3-5m3" },
  { id: "utilitaire-6-12", name: "Utilitaire 6-12m3" },
  { id: "utilitaire-12-15", name: "Utilitaire 12-15m3" },
  { id: "utilitaire-15-20", name: "Utilitaire 15-20m3" },
  { id: "utilitaire-20-plus", name: "Utilitaire + de 20m3" },
];

// Structure de données organisée par marque et modèle pour chaque catégorie
export const vehicleBrands = {
  citadine: ["Peugeot", "Renault", "Citroën", "Fiat", "Toyota", "Hyundai"],
  berline: ["Peugeot", "Renault", "BMW", "Mercedes", "Audi", "Volkswagen"],
  suv: ["Peugeot", "Renault", "Nissan", "Toyota", "Hyundai", "Volkswagen"],
  "utilitaire-3-5": ["Renault", "Citroën", "Peugeot", "Fiat", "Mercedes"],
  "utilitaire-6-12": ["Renault", "Citroën", "Peugeot", "Ford", "Volkswagen"],
  "utilitaire-12-15": ["Renault", "Citroën", "Peugeot", "Ford", "Mercedes"],
  "utilitaire-15-20": ["Renault", "Citroën", "Peugeot", "Ford"],
  "utilitaire-20-plus": ["Renault", "Citroën", "Peugeot", "Ford", "Mercedes"]
};

// Les modèles disponibles pour chaque marque dans chaque catégorie
export const vehicleModels = {
  citadine: {
    Peugeot: ["108", "208"],
    Renault: ["Clio", "Twingo"],
    Citroën: ["C1", "C3"],
    Fiat: ["500", "Panda"],
    Toyota: ["Aygo", "Yaris"],
    Hyundai: ["i10", "i20"]
  },
  berline: {
    Peugeot: ["508", "308"],
    Renault: ["Talisman", "Megane"],
    BMW: ["Série 3", "Série 5"],
    Mercedes: ["Classe C", "Classe E"],
    Audi: ["A4", "A6"],
    Volkswagen: ["Passat", "Golf"]
  },
  suv: {
    Peugeot: ["3008", "5008"],
    Renault: ["Kadjar", "Koleos"],
    Nissan: ["Qashqai", "X-Trail"],
    Toyota: ["RAV4", "C-HR"],
    Hyundai: ["Tucson", "Santa Fe"],
    Volkswagen: ["Tiguan", "T-Roc"]
  },
  "utilitaire-3-5": {
    Renault: ["Kangoo"],
    Citroën: ["Berlingo"],
    Peugeot: ["Partner"],
    Fiat: ["Doblo"],
    Mercedes: ["Citan"]
  },
  "utilitaire-6-12": {
    Renault: ["Trafic"],
    Citroën: ["Jumpy"],
    Peugeot: ["Expert"],
    Ford: ["Transit Custom"],
    Volkswagen: ["Transporter"]
  },
  "utilitaire-12-15": {
    Renault: ["Master"],
    Citroën: ["Jumper"],
    Peugeot: ["Boxer"],
    Ford: ["Transit"],
    Mercedes: ["Sprinter"]
  },
  "utilitaire-15-20": {
    Renault: ["Master L3H3"],
    Citroën: ["Jumper L3H3"],
    Peugeot: ["Boxer L3H3"],
    Ford: ["Transit L3H3"]
  },
  "utilitaire-20-plus": {
    Renault: ["Master L4H3"],
    Citroën: ["Jumper L4H3"],
    Peugeot: ["Boxer L4H3"],
    Ford: ["Transit L4H3"],
    Mercedes: ["Sprinter L4H3"]
  }
};

// Fonction pour récupérer les marques disponibles pour une catégorie
export const getBrandsByCategory = (categoryId: string): string[] => {
  return vehicleBrands[categoryId as keyof typeof vehicleBrands] || [];
};

// Fonction pour récupérer les modèles disponibles pour une marque et une catégorie
export const getModelsByBrandAndCategory = (categoryId: string, brand: string): string[] => {
  const categoryModels = vehicleModels[categoryId as keyof typeof vehicleModels];
  return categoryModels && categoryModels[brand as keyof typeof categoryModels] || [];
};

// La fonction existante pour compatibilité, à terme nous pourrons la supprimer
export const getVehiclesByCategory = (categoryId: string) => {
  const brands = getBrandsByCategory(categoryId);
  const allVehicles: string[] = [];
  
  brands.forEach(brand => {
    const models = getModelsByBrandAndCategory(categoryId, brand);
    models.forEach(model => {
      allVehicles.push(`${brand} ${model}`);
    });
  });
  
  return allVehicles;
};
