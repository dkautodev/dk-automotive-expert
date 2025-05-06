
import { supabase } from "@/integrations/supabase/client";

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
