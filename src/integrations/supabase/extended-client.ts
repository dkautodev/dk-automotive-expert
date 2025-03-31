
import { supabase } from "./client";
import { ExtendedDatabase } from "@/types/supabase-extended";

// Cast the existing supabase client to our extended type
// This is a workaround until we can regenerate the proper types
export const extendedSupabase = supabase as unknown as ReturnType<typeof createExtendedClient>;

// Helper function to create a properly typed client (not used directly, just for type inference)
import { createClient } from '@supabase/supabase-js';
function createExtendedClient() {
  const supabaseUrl = "https://example.com"; // Dummy values, just used for typing
  const supabaseKey = "dummy";
  return createClient<ExtendedDatabase>(supabaseUrl, supabaseKey);
}
