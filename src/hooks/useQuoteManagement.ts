import { Quote } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";

export const useQuoteManagement = () => {
  const saveQuote = async (quote: Quote) => {
    // Convert vehicles to a JSON-compatible format
    const vehiclesJson = quote.vehicles.map(vehicle => ({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      fuel: vehicle.fuel,
      licensePlate: vehicle.licensePlate,
      files: [] // Files are handled separately
    }));

    // Ensure we have a proper UUID format
    const quoteData = {
      pickup_address: quote.pickupAddress,
      delivery_address: quote.deliveryAddress,
      vehicles: vehiclesJson,
      total_price_ht: quote.totalPriceHT,
      status: quote.status,
      date_created: quote.dateCreated.toISOString()
    };

    const { error } = await supabase
      .from('quotes')
      .insert([quoteData]);

    if (error) {
      throw new Error(`Error saving quote: ${error.message}`);
    }
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
      pickupAddress: data.pickup_address,
      deliveryAddress: data.delivery_address,
      vehicles: data.vehicles,
      totalPriceHT: data.total_price_ht,
      status: data.status,
      dateCreated: new Date(data.date_created)
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
