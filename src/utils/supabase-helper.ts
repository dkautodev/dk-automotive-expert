
import { supabase } from "@/integrations/supabase/client";

/**
 * A helper function to safely access tables that might not be in the TypeScript types yet.
 * This is a temporary solution until the types can be properly updated.
 * 
 * @param tableName The name of the table to access
 * @returns A query builder for the specified table
 */
export function safeTable(tableName: string) {
  // @ts-ignore - This is intentional to work around TypeScript limitations
  return supabase.from(tableName);
}
