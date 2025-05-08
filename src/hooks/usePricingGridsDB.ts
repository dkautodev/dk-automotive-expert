
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PriceGrid } from '@/components/admin/pricingTypes';

export const usePricingGridsDB = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingGrid, setSavingGrid] = useState<boolean>(false);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});
  
  // Détermine si l'utilisateur a des droits d'admin
  const isAdmin = true; // À remplacer par la logique réelle d'autorisation

  // Charger les grilles tarifaires depuis la table pricing_grids_public
  const loadPriceGrids = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .order('vehicle_category', { ascending: true })
        .order('min_distance', { ascending: true });
      
      if (error) {
        console.error('Erreur lors du chargement des grilles tarifaires:', error);
        toast.error('Erreur lors du chargement des grilles tarifaires');
        return;
      }
      
      // Transformer les données en format PriceGrid
      const vehicleGroups: Record<string, any[]> = {};
      
      data?.forEach(row => {
        if (!vehicleGroups[row.vehicle_category]) {
          vehicleGroups[row.vehicle_category] = [];
        }
        vehicleGroups[row.vehicle_category].push(row);
      });
      
      const formattedGrids: PriceGrid[] = [];
      
      for (const vehicleType in vehicleGroups) {
        const rows = vehicleGroups[vehicleType];
        
        if (rows.length > 0) {
          const firstRow = rows[0];
          
          const grid: PriceGrid = {
            vehicleTypeId: vehicleType,
            vehicleTypeName: firstRow.vehicle_category,
            prices: rows.map(row => ({
              rangeId: `${row.min_distance}-${row.max_distance}`,
              priceHT: row.price_ht.toString()
            }))
          };
          
          formattedGrids.push(grid);
        }
      }
      
      setPriceGrids(formattedGrids);
    } catch (error) {
      console.error('Erreur lors du chargement des grilles tarifaires:', error);
      toast.error('Erreur lors du chargement des grilles tarifaires');
    } finally {
      setLoading(false);
    }
  };

  // Récupère le prix pour un type de véhicule et une distance donnée
  const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
    try {
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .eq('vehicle_category', vehicleTypeId)
        .lte('min_distance', distance)
        .gte('max_distance', distance)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        return null;
      }
      
      if (!data) {
        console.warn(`Aucun prix trouvé pour ${vehicleTypeId} à la distance ${distance}`);
        return null;
      }
      
      let finalPriceHT: number;
      
      if (data.type_tarif === 'par_km') {
        finalPriceHT = data.price_ht * distance;
      } else {
        finalPriceHT = data.price_ht;
      }
      
      return {
        priceHT: finalPriceHT.toString(),
        priceTTC: (finalPriceHT * 1.2).toFixed(2),
        isPerKm: data.type_tarif === 'par_km'
      };
    } catch (error: any) {
      console.error('Error getting price:', error);
      return null;
    }
  };

  // Fonctions pour éditer les grilles tarifaires
  const handleEditGrid = (vehicleTypeId: string) => {
    setEditingGrid(vehicleTypeId);
    
    // Initialiser les prix édités avec les valeurs actuelles
    const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
    if (grid) {
      const prices: Record<string, { ht: string, ttc: string }> = {};
      grid.prices.forEach(p => {
        prices[p.rangeId] = { 
          ht: p.priceHT, 
          ttc: (parseFloat(p.priceHT) * 1.2).toFixed(2)
        };
      });
      setEditedPrices(prices);
    }
  };

  const handleSaveGrid = async (vehicleTypeId: string) => {
    if (!isAdmin) {
      toast.error("Vous n'avez pas les droits pour modifier les grilles tarifaires");
      return;
    }
    
    setSavingGrid(true);
    try {
      const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
      if (!grid) {
        toast.error("Grille tarifaire non trouvée");
        return;
      }
      
      // Mettre à jour les prix dans la base de données
      for (const priceEntry of grid.prices) {
        const rangeId = priceEntry.rangeId;
        const editedPrice = editedPrices[rangeId];
        
        if (editedPrice) {
          const [minDistance, maxDistance] = rangeId.split('-').map(Number);
          
          // Déterminer si c'est un prix au km (pour les distances > 100km)
          const isPerKm = minDistance > 100;
          
          const { error } = await supabase
            .from('pricing_grids_public')
            .update({ 
              price_ht: parseFloat(editedPrice.ht),
              price_ttc: parseFloat(editedPrice.ttc),
              type_tarif: isPerKm ? 'par_km' : 'forfait',
              updated_at: new Date().toISOString()
            })
            .eq('vehicle_category', vehicleTypeId)
            .eq('min_distance', minDistance)
            .eq('max_distance', maxDistance);
          
          if (error) {
            console.error('Erreur lors de la mise à jour du prix:', error);
            toast.error(`Erreur lors de la mise à jour de la tranche ${rangeId}`);
          }
        }
      }
      
      toast.success("Grille tarifaire mise à jour avec succès");
      await loadPriceGrids();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la grille tarifaire:', error);
      toast.error("Erreur lors de la sauvegarde de la grille tarifaire");
    } finally {
      setSavingGrid(false);
      setEditingGrid(null);
      setEditedPrices({});
    }
  };

  const handlePriceHTChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const ttcValue = (parseFloat(sanitizedValue) * 1.2).toFixed(2);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: sanitizedValue,
        ttc: isNaN(parseFloat(ttcValue)) ? '0.00' : ttcValue
      },
    }));
  };

  const handlePriceTTCChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const htValue = (parseFloat(sanitizedValue) / 1.2).toFixed(2);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: isNaN(parseFloat(htValue)) ? '0.00' : htValue,
        ttc: sanitizedValue
      },
    }));
  };

  // Chargement initial des grilles tarifaires
  useEffect(() => {
    loadPriceGrids();
  }, []);

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
    getPriceForVehicleAndDistance,
    loadPriceGrids
  };
};
