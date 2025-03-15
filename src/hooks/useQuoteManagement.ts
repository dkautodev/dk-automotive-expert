
import { Quote } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";

export const useQuoteManagement = () => {
  const saveQuote = async (quote: Quote) => {
    const vehiclesJson = quote.vehicles.map(vehicle => ({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      fuel: vehicle.fuel,
      licensePlate: vehicle.licensePlate,
      files: []
    }));

    const quoteData = {
      pickup_address: quote.pickupAddress,
      delivery_address: quote.deliveryAddress,
      vehicles: vehiclesJson,
      total_price_ht: quote.totalPriceHT,
      total_price_ttc: quote.totalPriceTTC,
      distance: quote.distance,
      status: quote.status,
      date_created: quote.dateCreated.toISOString(),
      pickup_date: quote.pickupDate?.toISOString().split('T')[0],
      pickup_time: quote.pickupTime,
      delivery_date: quote.deliveryDate?.toISOString().split('T')[0],
      delivery_time: quote.deliveryTime
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
      totalPriceTTC: quote.total_price_ttc,
      distance: quote.distance,
      status: quote.status,
      dateCreated: new Date(quote.date_created),
      pickupDate: quote.pickup_date ? new Date(quote.pickup_date) : undefined,
      pickupTime: quote.pickup_time,
      deliveryDate: quote.delivery_date ? new Date(quote.delivery_date) : undefined,
      deliveryTime: quote.delivery_time
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
      totalPriceTTC: data.total_price_ttc,
      distance: data.distance,
      status: data.status,
      dateCreated: new Date(data.date_created),
      pickupDate: data.pickup_date ? new Date(data.pickup_date) : undefined,
      pickupTime: data.pickup_time,
      deliveryDate: data.delivery_date ? new Date(data.delivery_date) : undefined,
      deliveryTime: data.delivery_time
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
