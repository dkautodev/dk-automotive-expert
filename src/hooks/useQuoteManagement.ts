
import { Quote } from "@/types/order";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const useQuoteManagement = () => {
  const saveQuote = async (quote: Quote) => {
    const { error } = await supabase
      .from('quotes')
      .insert([
        {
          id: quote.id,
          pickup_address: quote.pickupAddress,
          delivery_address: quote.deliveryAddress,
          vehicles: quote.vehicles,
          total_price_ht: quote.totalPriceHT,
          status: quote.status,
          date_created: quote.dateCreated
        }
      ]);

    if (error) {
      throw new Error(`Error saving quote: ${error.message}`);
    }
  };

  const fetchQuotes = async (): Promise<Quote[]> => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      throw new Error(`Error fetching quotes: ${error.message}`);
    }

    return data.map((quote) => ({
      id: quote.id,
      pickupAddress: quote.pickup_address,
      deliveryAddress: quote.delivery_address,
      vehicles: quote.vehicles,
      totalPriceHT: quote.total_price_ht,
      status: quote.status,
      dateCreated: new Date(quote.date_created)
    }));
  };

  return {
    saveQuote,
    fetchQuotes
  };
};
