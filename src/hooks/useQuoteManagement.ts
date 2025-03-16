import { Quote } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow } from "@/types/database";

export const useQuoteManagement = () => {
  const saveQuote = async (quote: Quote) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to save a quote");
    }

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
      total_price_ht: Number(quote.totalPriceHT.toFixed(2)),
      total_price_ttc: Number(quote.totalPriceTTC.toFixed(2)),
      distance: Number(quote.distance) || null,
      status: quote.status,
      date_created: quote.dateCreated.toISOString(),
      pickup_date: quote.pickupDate?.toISOString().split('T')[0] || null,
      pickup_time: quote.pickupTime || null,
      delivery_date: quote.deliveryDate?.toISOString().split('T')[0] || null,
      delivery_time: quote.deliveryTime || null,
      user_id: user.id
    };

    const { error, data } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving quote: ${error.message}`);
    }

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
      quote_number: quote.quote_number || '',
      pickupAddress: quote.pickup_address,
      deliveryAddress: quote.delivery_address,
      vehicles: quote.vehicles,
      totalPriceHT: quote.total_price_ht,
      totalPriceTTC: quote.total_price_ttc || quote.total_price_ht * 1.2,
      distance: Number(quote.distance) || 0,
      status: quote.status as 'pending' | 'accepted' | 'rejected',
      dateCreated: new Date(quote.date_created || new Date()),
      pickupDate: quote.pickup_date ? new Date(quote.pickup_date) : undefined,
      pickupTime: quote.pickup_time || undefined,
      deliveryDate: quote.delivery_date ? new Date(quote.delivery_date) : undefined,
      deliveryTime: quote.delivery_time || undefined
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
      totalPriceTTC: data.total_price_ttc || data.total_price_ht * 1.2,
      distance: Number(data.distance) || 0,
      status: data.status as 'pending' | 'accepted' | 'rejected',
      dateCreated: new Date(data.date_created || new Date()),
      pickupDate: data.pickup_date ? new Date(data.pickup_date) : undefined,
      pickupTime: data.pickup_time || undefined,
      deliveryDate: data.delivery_date ? new Date(data.delivery_date) : undefined,
      deliveryTime: data.delivery_time || undefined
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
