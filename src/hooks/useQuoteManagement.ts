
import { Quote } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";
import { Json } from "@/integrations/supabase/types";

export const useQuoteManagement = () => {
  const saveQuote = async (quote: Quote) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to save a quote");
    }

    const quoteData = {
      pickup_address: quote.pickupAddress,
      delivery_address: quote.deliveryAddress,
      vehicles: quote.vehicles as Json,
      total_price_ht: Number(quote.totalPriceHT.toFixed(2)),
      total_price_ttc: Number(quote.totalPriceTTC.toFixed(2)),
      distance: Number(quote.distance),
      status: quote.status,
      date_created: quote.dateCreated.toISOString(),
      pickup_date: quote.pickupDate.toISOString().split('T')[0],
      pickup_time: quote.pickupTime,
      delivery_date: quote.deliveryDate.toISOString().split('T')[0],
      delivery_time: quote.deliveryTime,
      pickup_contact: quote.pickupContact as Json,
      delivery_contact: quote.deliveryContact as Json,
      user_id: user.id,
      quote_number: await generateQuoteNumber()
    };

    const { error, data } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving quote: ${error.message}`);
    }

    return data;
  };

  const generateQuoteNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_quote_number');
    if (error) throw error;
    return data;
  };

  const fetchQuotes = async (): Promise<Quote[]> => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('status', 'pending') as { data: QuoteRow[] | null; error: any };

    if (error) {
      throw new Error(`Error fetching quotes: ${error.message}`);
    }

    if (!data) return [];

    return data.map((quote): Quote => ({
      id: quote.id,
      quote_number: quote.quote_number,
      pickupAddress: quote.pickup_address,
      deliveryAddress: quote.delivery_address,
      vehicles: quote.vehicles,
      totalPriceHT: quote.total_price_ht,
      totalPriceTTC: quote.total_price_ttc,
      distance: Number(quote.distance),
      status: quote.status as 'pending' | 'accepted' | 'rejected',
      dateCreated: new Date(quote.date_created || new Date()),
      pickupDate: new Date(quote.pickup_date),
      pickupTime: quote.pickup_time,
      deliveryDate: new Date(quote.delivery_date),
      deliveryTime: quote.delivery_time,
      pickupContact: quote.pickup_contact,
      deliveryContact: quote.delivery_contact
    }));
  };

  const fetchQuoteById = async (id: string): Promise<Quote | null> => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .maybeSingle() as { data: QuoteRow | null; error: any };

    if (error) {
      throw new Error(`Error fetching quote: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      quote_number: data.quote_number || '',
      pickupAddress: data.pickup_address,
      deliveryAddress: data.delivery_address,
      vehicles: data.vehicles,
      totalPriceHT: data.total_price_ht,
      totalPriceTTC: data.total_price_ttc,
      distance: Number(data.distance),
      status: data.status as 'pending' | 'accepted' | 'rejected',
      dateCreated: new Date(data.date_created || new Date()),
      pickupDate: new Date(data.pickup_date),
      pickupTime: data.pickup_time,
      deliveryDate: new Date(data.delivery_date),
      deliveryTime: data.delivery_time,
      pickupContact: data.pickup_contact,
      deliveryContact: data.delivery_contact
    };
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting quote: ${error.message}`);
    }
  };

  return {
    saveQuote,
    fetchQuotes,
    fetchQuoteById,
    deleteQuote
  };
};
