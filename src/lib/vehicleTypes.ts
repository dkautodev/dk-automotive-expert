
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

export const vehicleCategories = {
  citadine: ["Peugeot 108", "Renault Clio", "Citroën C1", "Fiat 500", "Toyota Aygo", "Hyundai i10"],
  berline: ["Peugeot 508", "Renault Talisman", "BMW Série 3", "Mercedes Classe C", "Audi A4", "Volkswagen Passat"],
  suv: ["Peugeot 3008", "Renault Kadjar", "Nissan Qashqai", "Toyota RAV4", "Hyundai Tucson", "Volkswagen Tiguan"],
  "utilitaire-3-5": ["Renault Kangoo", "Citroën Berlingo", "Peugeot Partner", "Fiat Doblo", "Mercedes Citan"],
  "utilitaire-6-12": ["Renault Trafic", "Citroën Jumpy", "Peugeot Expert", "Ford Transit Custom", "Volkswagen Transporter"],
  "utilitaire-12-15": ["Renault Master", "Citroën Jumper", "Peugeot Boxer", "Ford Transit", "Mercedes Sprinter"],
  "utilitaire-15-20": ["Renault Master L3H3", "Citroën Jumper L3H3", "Peugeot Boxer L3H3", "Ford Transit L3H3"],
  "utilitaire-20-plus": ["Renault Master L4H3", "Citroën Jumper L4H3", "Peugeot Boxer L4H3", "Ford Transit L4H3", "Mercedes Sprinter L4H3"]
};

export const getVehiclesByCategory = (categoryId: string) => {
  return vehicleCategories[categoryId as keyof typeof vehicleCategories] || [];
};
