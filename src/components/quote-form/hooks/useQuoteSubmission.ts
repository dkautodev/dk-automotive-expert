
import { toast } from 'sonner';
import { QuoteFormValues } from '../quoteFormSchema';
import { supabase } from '@/services/mockSupabaseClient';

export const useQuoteSubmission = () => {
  const [loading, setLoading] = useState(false);

  const submitQuote = async (values: QuoteFormValues) => {
    setLoading(true);
    
    try {
      console.log('Submitting quote with values:', values);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful quote submission
      toast.success('Votre demande de devis a été envoyée avec succès !');
      
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast.error('Erreur lors de l\'envoi du devis: ' + (error.message || 'Erreur inconnue'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return { submitQuote, loading };
};
