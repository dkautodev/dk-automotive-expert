
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PriceGrid } from '@/components/admin/pricingTypes';
import { calculateTTC } from '@/utils/priceCalculations';
import { useAuthContext } from '@/context/AuthContext';
import { 
  fetchPriceGrids, 
  initializeDefaultPriceGrids, 
  updatePriceInDB,
  getPriceForVehicleAndDistance as getPrice
} from '@/services/pricingGridsService';
import { formatDBRowsToGrids } from '@/utils/pricingFormatters';

export const usePricingGridsDB = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>([]);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingGrid, setSavingGrid] = useState(false);
  const { role } = useAuthContext();

  const isAdmin = role === 'admin';

  // Charger les grilles de prix depuis la base de données
  useEffect(() => {
    const loadPriceGrids = async () => {
      setLoading(true);
      try {
        const data = await fetchPriceGrids();
        
        if (data && data.length > 0) {
          // Convertir les données de la BD en structure utilisée par l'application
          const formattedGrids = formatDBRowsToGrids(data);
          setPriceGrids(formattedGrids);
        } else {
          // Si aucune donnée n'est trouvée, initialiser avec des valeurs par défaut
          const defaultGrids = await initializeDefaultPriceGrids();
          setPriceGrids(defaultGrids);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des grilles tarifaires:', error);
        toast.error('Erreur lors du chargement des grilles tarifaires');
      } finally {
        setLoading(false);
      }
    };

    loadPriceGrids();
  }, []);

  const handleEditGrid = (vehicleTypeId: string) => {
    if (!isAdmin) {
      toast.error('Vous n\'avez pas les droits pour modifier les grilles tarifaires');
      return;
    }
    
    setEditingGrid(vehicleTypeId);
    
    // Initialiser les prix édités avec les valeurs actuelles
    const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
    if (grid) {
      const prices: Record<string, { ht: string, ttc: string }> = {};
      grid.prices.forEach(p => {
        prices[p.rangeId] = { 
          ht: p.priceHT, 
          ttc: calculateTTC(p.priceHT) 
        };
      });
      setEditedPrices(prices);
    }
  };

  const handleSaveGrid = async (vehicleTypeId: string) => {
    if (!isAdmin) {
      toast.error('Vous n\'avez pas les droits pour modifier les grilles tarifaires');
      return;
    }

    setSavingGrid(true);

    try {
      // Mettre à jour les prix dans la base de données
      const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
      if (grid) {
        const updatePromises = grid.prices.map(async (price) => {
          const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
          return updatePriceInDB(
            vehicleTypeId, 
            price.rangeId, 
            parseFloat(newPriceHT)
          );
        });
        
        await Promise.all(updatePromises);
        
        // Si la grille actuelle est Citadine ou Berline, mettre à jour l'autre aussi
        if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
          const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
          
          // Mettre à jour également dans la base de données pour l'autre véhicule
          const updateOtherPromises = grid.prices.map(async (price) => {
            const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
            return updatePriceInDB(
              otherGridId, 
              price.rangeId, 
              parseFloat(newPriceHT)
            );
          });
          
          await Promise.all(updateOtherPromises);
        }
      }

      // Maintenant que toutes les opérations DB sont terminées, nous mettons à jour l'état local
      const updatedGrids = [...priceGrids];
      const gridIndex = updatedGrids.findIndex(g => g.vehicleTypeId === vehicleTypeId);
      
      if (gridIndex !== -1) {
        // Mettre à jour la grille actuelle avec les nouveaux prix
        updatedGrids[gridIndex] = {
          ...updatedGrids[gridIndex],
          prices: updatedGrids[gridIndex].prices.map(price => ({
            ...price,
            priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
          })),
        };
        
        // Si la grille actuelle est Citadine ou Berline, mettre à jour l'autre aussi
        if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
          const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
          const otherGridIndex = updatedGrids.findIndex(g => g.vehicleTypeId === otherGridId);
          
          if (otherGridIndex !== -1) {
            // Copier les prix de la grille actuelle vers l'autre grille
            updatedGrids[otherGridIndex] = {
              ...updatedGrids[otherGridIndex],
              prices: [...updatedGrids[gridIndex].prices],
            };
          }
        }
      }
      
      // Mettre à jour l'état
      setPriceGrids(updatedGrids);

      toast.success('Grille tarifaire enregistrée avec succès');
      setEditingGrid(null);
      setEditedPrices({});
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de la grille tarifaire:', error);
      toast.error('Erreur lors de la sauvegarde de la grille tarifaire');
    } finally {
      setSavingGrid(false);
    }
  };

  const handlePriceHTChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const ttcValue = calculateTTC(sanitizedValue);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: sanitizedValue,
        ttc: ttcValue
      },
    }));
  };

  const handlePriceTTCChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const htValue = (parseFloat(sanitizedValue) / 1.2).toFixed(2);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: htValue,
        ttc: sanitizedValue
      },
    }));
  };

  // Fonction pour récupérer les prix pour un type de véhicule et une distance donnée
  const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
    try {
      const selectedPrice = await getPrice(vehicleTypeId, distance);
      
      return {
        priceHT: selectedPrice.priceHT.toString(),
        priceTTC: calculateTTC(selectedPrice.priceHT.toString()),
        isPerKm: selectedPrice.isPerKm
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération du prix:', error);
      return null;
    }
  };

  return {
    priceGrids,
    editingGrid,
    editedPrices,
    loading,
    savingGrid,
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
    getPriceForVehicleAndDistance
  };
};
