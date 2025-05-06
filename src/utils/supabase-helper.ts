
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * A helper function to safely access tables that might not be in the TypeScript types yet.
 * This is a temporary solution until the types can be properly updated.
 * 
 * @param tableName The name of the table to access
 * @returns A query builder for the specified table
 */
export function safeTable(tableName: string) {
  // Use type assertion to bypass TypeScript's type checking for unknown tables
  return supabase.from(tableName as any);
}

/**
 * Type guard to check if a response contains an error
 */
export function isSupabaseError(obj: any): obj is PostgrestError {
  return obj && typeof obj === 'object' && 'code' in obj && 'message' in obj;
}

/**
 * Type guard to check if a response contains data
 */
export function hasData<T>(obj: any): obj is { data: T } {
  return obj && typeof obj === 'object' && 'data' in obj && obj.data !== null;
}

/**
 * Safely handles data from a Supabase query response, dealing with potential errors
 * @param response The response from a Supabase query
 * @param defaultValue The default value to return if there's an error or no data
 * @returns The data from the response or the default value
 */
export function safeDataAccess<T>(response: PostgrestResponse<T> | PostgrestSingleResponse<T> | any, defaultValue: T): T {
  if (response?.error) {
    console.error("Supabase query error:", response.error);
    return defaultValue;
  }
  
  // Check if data is available and not null
  if (response?.data === null || response?.data === undefined) {
    return defaultValue;
  }
  
  return response.data || defaultValue;
}

/**
 * Safely extracts a single item from a Supabase query response
 * @param response The response from a Supabase query
 * @param defaultValue The default value to return if there's an error or no data
 * @returns The first item from the data array or the default value
 */
export function safeFirstItem<T>(response: PostgrestResponse<T> | any, defaultValue: T extends Array<infer U> ? U : T): T extends Array<infer U> ? U : T {
  if (response?.error || !response?.data || !Array.isArray(response?.data) || response.data.length === 0) {
    if (response?.error) {
      console.error("Supabase query error:", response.error);
    }
    return defaultValue;
  }
  return response.data[0] as any;
}

/**
 * Safely converts a query response to a typed array, handling errors and empty results
 * @param response The response from a Supabase query
 * @param defaultValue The default array to return if there's an error or no data
 * @returns A properly typed array of items
 */
export function safeArrayData<T>(response: PostgrestResponse<T[]> | any, defaultValue: T[] = []): T[] {
  if (response?.error) {
    console.error("Supabase query error:", response.error);
    return defaultValue;
  }
  
  if (!response?.data || !Array.isArray(response.data)) {
    return defaultValue;
  }
  
  return response.data as T[];
}

/**
 * Safely maps over items in a response array with a transform function
 * @param response The response from a Supabase query
 * @param mapFn The function to transform each item
 * @param defaultValue The default array to return if there's an error
 * @returns An array of transformed items
 */
export function safeMapData<T, R>(
  response: PostgrestResponse<T[]> | any,
  mapFn: (item: T) => R,
  defaultValue: R[] = []
): R[] {
  if (response?.error) {
    console.error("Supabase query error:", response.error);
    return defaultValue;
  }
  
  if (!response?.data || !Array.isArray(response.data)) {
    return defaultValue;
  }
  
  try {
    return response.data.map(mapFn);
  } catch (error) {
    console.error("Error mapping data:", error);
    return defaultValue;
  }
}
