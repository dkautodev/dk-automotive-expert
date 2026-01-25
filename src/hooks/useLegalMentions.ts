
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

  const updateLegalMention = async (id: string, updates: { field_value?: string; field_label?: string; field_key?: string }) => {
    try {
      const { error } = await supabase
        .from('legal_mentions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating legal mention:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setLegalMentions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
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

  const addLegalMention = async (type: 'basic' | 'section') => {
    try {
      const nextOrder = legalMentions.length > 0 
        ? Math.max(...legalMentions.map(s => s.display_order)) + 1 
        : 1;
      
      if (type === 'basic') {
        const newMention = {
          field_key: `nouveau_champ_${nextOrder}`,
          field_label: `Nouveau champ ${nextOrder}`,
          field_value: '',
          display_order: nextOrder,
          is_active: true
        };

        const { data, error } = await supabase
          .from('legal_mentions')
          .insert(newMention)
          .select()
          .single();

        if (error) {
          console.error('Error adding legal mention:', error);
          toast.error('Erreur lors de l\'ajout du champ');
          return false;
        }

        setLegalMentions(prev => [...prev, data]);
        toast.success('Champ ajouté avec succès');
        return true;
      } else {
        // Add a section with titre and contenu
        const sectionKey = `section_${nextOrder}`;
        const titreData = {
          field_key: `${sectionKey}_titre`,
          field_label: `Titre section ${nextOrder}`,
          field_value: '',
          display_order: nextOrder,
          is_active: true
        };
        const contenuData = {
          field_key: `${sectionKey}_contenu`,
          field_label: `Contenu section ${nextOrder}`,
          field_value: '',
          display_order: nextOrder + 1,
          is_active: true
        };

        const { data: titreResult, error: titreError } = await supabase
          .from('legal_mentions')
          .insert(titreData)
          .select()
          .single();

        if (titreError) {
          console.error('Error adding titre:', titreError);
          toast.error('Erreur lors de l\'ajout de la section');
          return false;
        }

        const { data: contenuResult, error: contenuError } = await supabase
          .from('legal_mentions')
          .insert(contenuData)
          .select()
          .single();

        if (contenuError) {
          console.error('Error adding contenu:', contenuError);
          toast.error('Erreur lors de l\'ajout de la section');
          return false;
        }

        setLegalMentions(prev => [...prev, titreResult, contenuResult]);
        toast.success('Section ajoutée avec succès');
        return true;
      }
    } catch (error) {
      console.error('Error adding legal mention:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  const deleteLegalMention = async (id: string, isSection?: boolean, sectionKey?: string) => {
    try {
      if (isSection && sectionKey) {
        // Delete both titre and contenu for the section
        const { error } = await supabase
          .from('legal_mentions')
          .delete()
          .or(`field_key.eq.${sectionKey}_titre,field_key.eq.${sectionKey}_contenu`);

        if (error) {
          console.error('Error deleting section:', error);
          toast.error('Erreur lors de la suppression');
          return false;
        }

        setLegalMentions(prev => prev.filter(item => 
          item.field_key !== `${sectionKey}_titre` && item.field_key !== `${sectionKey}_contenu`
        ));
      } else {
        const { error } = await supabase
          .from('legal_mentions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting legal mention:', error);
          toast.error('Erreur lors de la suppression');
          return false;
        }

        setLegalMentions(prev => prev.filter(item => item.id !== id));
      }
      
      toast.success('Suppression effectuée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting legal mention:', error);
      toast.error('Erreur lors de la suppression');
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
    addLegalMention,
    deleteLegalMention,
    refreshLegalMentions: fetchLegalMentions
  };
};
