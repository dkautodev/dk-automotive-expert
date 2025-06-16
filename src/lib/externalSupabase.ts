
import { createClient } from '@supabase/supabase-js';

// Configuration pour la base de données externe (grille tarifaire uniquement)
const EXTERNAL_SUPABASE_URL = "https://jaurkjcipcxkjimjlpiq.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdXJramNpcGN4a2ppbWpscGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTQzNDUsImV4cCI6MjA2MjE5MDM0NX0.NkP7nMqBTibQ5J85fNYU5ppeCTVnytcScITCvlSzbkE";

// Client Supabase externe pour la grille tarifaire uniquement
export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);
