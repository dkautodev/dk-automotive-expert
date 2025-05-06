
import { supabase } from './client';
import { safeTable } from '@/utils/supabase-helper';

/**
 * Extended Supabase client that can safely access tables that might not be fully typed yet.
 * Use this client when you need to access tables that aren't properly typed in the Supabase TypeScript definitions.
 */
export const extendedSupabase = {
  ...supabase,
  // Safely access any table regardless of TypeScript definitions
  from: (table: string) => safeTable(table),
};
