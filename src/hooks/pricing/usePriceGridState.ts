
import { useState, useEffect } from 'react';
import { PriceGrid } from '@/components/admin/pricingTypes';
import { toast } from 'sonner';
import { calculateTTC } from '@/utils/priceCalculations';
import { 
  fetchPriceGrids, 
  initializeDefaultPriceGrids, 
  updatePriceInDB 
} from '@/services/pricing/localPricingGridsService';
import { formatDBRowsToGrids } from '@/utils/pricingFormatters';

export const usePriceGridState = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>([]);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingGrid, setSavingGrid] = useState(false);
  
  // Déterminer si l'utilisateur est admin (pour simplifier, on suppose que c'est toujours le cas en mode local)
  const isAdmin = true;

  const loadPriceGrids = async () => {
    setLoading(true);
    try {
      console.log('Loading price grids');
      const data = await fetchPriceGrids();
      
      if (data && data.length > 0) {
        console.log('Formatting data from storage:', data);
        // Convertir les données du stockage au format de l'application
        const formattedGrids = formatDBRowsToGrids(data);
        console.log('Formatted grids:', formattedGrids);
        setPriceGrids(formattedGrids);
      } else {
        console.log('No data found, initializing defaults');
        // Si aucune donnée trouvée, initialiser avec des valeurs par défaut
        const defaultGrids = await initializeDefaultPriceGrids();
        setPriceGrids(defaultGrids);
      }
    } catch (error: any) {
      console.error('Error loading price grids:', error);
      toast.error('Error loading price grids: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Charger les grilles tarifaires au montage du composant
  useEffect(() => {
    loadPriceGrids();
  }, []);

  return {
    priceGrids,
    setPriceGrids,
    editingGrid,
    setEditingGrid,
    editedPrices,
    setEditedPrices,
    loading,
    setLoading,
    savingGrid,
    setSavingGrid,
    isAdmin,
    loadPriceGrids
  };
};
