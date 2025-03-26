
import { useState } from 'react';
import { PriceGrid } from '@/components/admin/pricingTypes';
import { toast } from 'sonner';
import { calculateTTC } from '@/utils/priceCalculations';
import { useAuthContext } from '@/context/AuthContext';
import { 
  fetchPriceGrids, 
  initializeDefaultPriceGrids, 
  updatePriceInDB 
} from '@/services/pricingGridsService';
import { formatDBRowsToGrids } from '@/utils/pricingFormatters';

export const usePriceGridState = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>([]);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingGrid, setSavingGrid] = useState(false);
  const { role } = useAuthContext();

  const isAdmin = role === 'admin';

  const loadPriceGrids = async () => {
    setLoading(true);
    try {
      const data = await fetchPriceGrids();
      
      if (data && data.length > 0) {
        // Convert DB data to application structure
        const formattedGrids = formatDBRowsToGrids(data);
        setPriceGrids(formattedGrids);
      } else {
        // If no data found, initialize with default values
        const defaultGrids = await initializeDefaultPriceGrids();
        setPriceGrids(defaultGrids);
      }
    } catch (error: any) {
      console.error('Error loading price grids:', error);
      toast.error('Error loading price grids');
    } finally {
      setLoading(false);
    }
  };

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
