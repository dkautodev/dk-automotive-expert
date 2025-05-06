
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

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
