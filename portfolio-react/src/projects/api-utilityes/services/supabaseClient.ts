import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * DISABLED ON PURPOSE FOR THE PUBLIC PORTFOLIO
 *
 * The real Supabase client and all database/Edge Function implementations are
 * kept in the repository as a code sample. The deployed demo always uses its
 * frontend simulation and will not connect even when VITE_SUPABASE_* exists.
 * Set this flag to `true` in a private deployment to reactivate the original
 * integration.
 */
const SUPABASE_CONNECTION_ENABLED = false;

export const hasSupabaseConfig =
  SUPABASE_CONNECTION_ENABLED &&
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey);

export const supabase =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
