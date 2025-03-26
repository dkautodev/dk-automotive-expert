
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PriceGrid, PriceRange } from '@/components/admin/pricingTypes';
import { calculateTTC } from '@/utils/priceCalculations';
import { useAuthContext } from '@/context/AuthContext';
import { distanceRanges } from './usePricingGrids';

export const usePricingGridsDB = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>([]);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});
  const [loading, setLoading] = useState(true);
  const { role } = useAuthContext();

  const isAdmin = role === 'admin';

  // Charger les grilles de prix depuis la base de données
  useEffect(() => {
    const fetchPriceGrids = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('price_grids')
          .select('*')
          .order('vehicle_type_id', { ascending: true })
          .order('distance_range_id', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Convertir les données de la BD en structure utilisée par l'application
          const vehicleTypes = [...new Set(data.map(row => row.vehicle_type_id))];
          
          const formattedGrids: PriceGrid[] = vehicleTypes.map(vehicleTypeId => {
            const vehicleRows = data.filter(row => row.vehicle_type_id === vehicleTypeId);
            const vehicleTypeName = vehicleRows[0]?.vehicle_type_name || '';
            
            const prices = vehicleRows.map(row => ({
              rangeId: row.distance_range_id,
              priceHT: row.price_ht.toString(),
            }));
            
            return {
              vehicleTypeId,
              vehicleTypeName,
              prices,
            };
          });
          
          setPriceGrids(formattedGrids);
        } else {
          // Si aucune donnée n'est trouvée, initialiser avec des valeurs par défaut
          await initializeDefaultPriceGrids();
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des grilles tarifaires:', error);
        toast.error('Erreur lors du chargement des grilles tarifaires');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceGrids();
  }, []);

  // Initialiser les grilles tarifaires avec des valeurs par défaut si la table est vide
  const initializeDefaultPriceGrids = async () => {
    try {
      const { data: vehicleTypesData, error: vehicleTypesError } = await supabase
        .from('vehicle_types')
        .select('id, name');

      if (vehicleTypesError) throw vehicleTypesError;

      const vehicleTypes = vehicleTypesData || [
        { id: 'citadine', name: 'Citadine' },
        { id: 'berline', name: 'Berline' },
        { id: 'monospace', name: 'Monospace' },
        { id: 'suv', name: 'SUV' },
        { id: 'utilitaire', name: 'Utilitaire' }
      ];

      const defaultGrids: PriceGrid[] = vehicleTypes.map((vehicleType) => ({
        vehicleTypeId: vehicleType.id,
        vehicleTypeName: vehicleType.name,
        prices: distanceRanges.map((range) => ({
          rangeId: range.id,
          priceHT: ((Math.random() * 50) + 50).toFixed(2), // Prix aléatoire entre 50 et 100€
        })),
      }));

      // Insérer les données par défaut dans la base de données
      for (const grid of defaultGrids) {
        for (const price of grid.prices) {
          const range = distanceRanges.find(r => r.id === price.rangeId);
          await supabase.from('price_grids').insert({
            vehicle_type_id: grid.vehicleTypeId,
            vehicle_type_name: grid.vehicleTypeName,
            distance_range_id: price.rangeId,
            distance_range_label: range?.label || '',
            price_ht: price.priceHT,
            is_per_km: range?.perKm || false
          });
        }
      }

      setPriceGrids(defaultGrids);
    } catch (error: any) {
      console.error('Erreur lors de l\'initialisation des grilles tarifaires:', error);
      toast.error('Erreur lors de l\'initialisation des grilles tarifaires');
    }
  };

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

    try {
      // Mettre à jour les prix dans la base de données
      const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
      if (grid) {
        for (const price of grid.prices) {
          const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
          
          const { error } = await supabase
            .from('price_grids')
            .update({ price_ht: newPriceHT })
            .match({ 
              vehicle_type_id: vehicleTypeId, 
              distance_range_id: price.rangeId 
            });
          
          if (error) throw error;
        }
      }

      // Mettre à jour l'état local
      setPriceGrids(prevGrids => {
        // Créer un nouveau tableau pour éviter de modifier l'état précédent
        const newGrids = [...prevGrids];
        
        // Trouver la grille en cours d'édition
        const gridIndex = newGrids.findIndex(g => g.vehicleTypeId === vehicleTypeId);
        
        if (gridIndex !== -1) {
          // Mettre à jour la grille actuelle avec les nouveaux prix
          newGrids[gridIndex] = {
            ...newGrids[gridIndex],
            prices: newGrids[gridIndex].prices.map(price => ({
              ...price,
              priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
            })),
          };
          
          // Si la grille actuelle est Citadine ou Berline, mettre à jour l'autre aussi
          if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
            const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
            const otherGridIndex = newGrids.findIndex(g => g.vehicleTypeId === otherGridId);
            
            if (otherGridIndex !== -1) {
              // Copier les prix de la grille actuelle vers l'autre grille
              newGrids[otherGridIndex] = {
                ...newGrids[otherGridIndex],
                prices: [...newGrids[gridIndex].prices],
              };

              // Mettre à jour également dans la base de données
              newGrids[gridIndex].prices.forEach(async (price) => {
                const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
                
                await supabase
                  .from('price_grids')
                  .update({ price_ht: newPriceHT })
                  .match({ 
                    vehicle_type_id: otherGridId, 
                    distance_range_id: price.rangeId 
                  });
              });
            }
          }
        }
        
        return newGrids;
      });

      toast.success('Grille tarifaire enregistrée avec succès');
      setEditingGrid(null);
      setEditedPrices({});
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de la grille tarifaire:', error);
      toast.error('Erreur lors de la sauvegarde de la grille tarifaire');
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
      const { data, error } = await supabase
        .from('price_grids')
        .select('*')
        .eq('vehicle_type_id', vehicleTypeId)
        .order('distance_range_id', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error(`Aucune grille tarifaire trouvée pour ${vehicleTypeId}`);
      }

      // Déterminer la tranche de distance appropriée
      let selectedPrice = null;
      
      for (const row of data) {
        const rangeId = row.distance_range_id;
        const isPerKm = row.is_per_km;
        
        // Extraire les nombres de la tranche (ex: "1-10" => [1, 10])
        const rangeParts = rangeId.split('-').map(Number);
        
        // Gérer le cas spécial "701+"
        if (rangeId === '701+' && distance > 700) {
          selectedPrice = isPerKm ? 
            { priceHT: parseFloat(row.price_ht) * distance, isPerKm } : 
            { priceHT: parseFloat(row.price_ht), isPerKm };
          break;
        }
        
        // Pour les autres tranches
        if (rangeParts.length === 2) {
          const [min, max] = rangeParts;
          if (distance >= min && distance <= max) {
            selectedPrice = isPerKm ? 
              { priceHT: parseFloat(row.price_ht) * distance, isPerKm } : 
              { priceHT: parseFloat(row.price_ht), isPerKm };
            break;
          }
        }
      }

      if (!selectedPrice) {
        throw new Error(`Aucun prix trouvé pour la distance ${distance}km et le véhicule ${vehicleTypeId}`);
      }

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
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
    getPriceForVehicleAndDistance
  };
};
