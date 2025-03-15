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

  return {
    saveQuote,
    fetchQuotes
  };
};
