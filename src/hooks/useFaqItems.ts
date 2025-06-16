
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useFaqItems = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaqItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQ items:', error);
        toast.error('Erreur lors du chargement des FAQ');
        return;
      }

      setFaqItems(data || []);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      toast.error('Erreur lors du chargement des FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  const createFaqItem = async (question: string, answer: string) => {
    try {
      const maxOrder = Math.max(...faqItems.map(item => item.display_order), 0);
      
      const { data, error } = await supabase
        .from('faq_items')
        .insert({
          question,
          answer,
          display_order: maxOrder + 1,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating FAQ item:', error);
        toast.error('Erreur lors de la création de la FAQ');
        return false;
      }

      setFaqItems(prev => [...prev, data]);
      toast.success('FAQ créée avec succès');
      return true;
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      toast.error('Erreur lors de la création de la FAQ');
      return false;
    }
  };

  const updateFaqItem = async (id: string, updates: Partial<FaqItem>) => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating FAQ item:', error);
        toast.error('Erreur lors de la mise à jour de la FAQ');
        return false;
      }

      setFaqItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      toast.success('FAQ mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      toast.error('Erreur lors de la mise à jour de la FAQ');
      return false;
    }
  };

  const deleteFaqItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ item:', error);
        toast.error('Erreur lors de la suppression de la FAQ');
        return false;
      }

      setFaqItems(prev => prev.filter(item => item.id !== id));
      toast.success('FAQ supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      toast.error('Erreur lors de la suppression de la FAQ');
      return false;
    }
  };

  const reorderFaqItems = async (reorderedItems: FaqItem[]) => {
    try {
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        display_order: index + 1
      }));

      const { error } = await supabase
        .from('faq_items')
        .upsert(updates.map(update => ({ 
          id: update.id, 
          display_order: update.display_order 
        })));

      if (error) {
        console.error('Error reordering FAQ items:', error);
        toast.error('Erreur lors du réordonnancement des FAQ');
        return false;
      }

      setFaqItems(reorderedItems.map((item, index) => ({
        ...item,
        display_order: index + 1
      })));
      
      toast.success('Ordre des FAQ mis à jour');
      return true;
    } catch (error) {
      console.error('Error reordering FAQ items:', error);
      toast.error('Erreur lors du réordonnancement des FAQ');
      return false;
    }
  };

  useEffect(() => {
    fetchFaqItems();
  }, []);

  return {
    faqItems,
    isLoading,
    createFaqItem,
    updateFaqItem,
    deleteFaqItem,
    reorderFaqItems,
    refreshFaqItems: fetchFaqItems
  };
};
