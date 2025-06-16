
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LegalMention {
  id: string;
  field_key: string;
  field_label: string;
  field_value: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLegalMentions = () => {
  const [legalMentions, setLegalMentions] = useState<LegalMention[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLegalMentions = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_mentions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching legal mentions:', error);
        toast.error('Erreur lors du chargement des mentions légales');
        return;
      }

      setLegalMentions(data || []);
    } catch (error) {
      console.error('Error fetching legal mentions:', error);
      toast.error('Erreur lors du chargement des mentions légales');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLegalMention = async (id: string, field_value: string) => {
    try {
      const { error } = await supabase
        .from('legal_mentions')
        .update({ field_value })
        .eq('id', id);

      if (error) {
        console.error('Error updating legal mention:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setLegalMentions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, field_value } : item
        )
      );
      toast.success('Mention légale mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating legal mention:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  useEffect(() => {
    fetchLegalMentions();
  }, []);

  return {
    legalMentions,
    isLoading,
    updateLegalMention,
    refreshLegalMentions: fetchLegalMentions
  };
};
