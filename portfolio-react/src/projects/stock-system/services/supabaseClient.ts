import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_STOCK_SUPABASE_URL as string | undefined;

const supabasePublishableKey = import.meta.env
  .VITE_STOCK_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const hasSupabaseEnv = Boolean(
  supabaseUrl && supabasePublishableKey
);

export const supabase: SupabaseClient | null = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabasePublishableKey!)
  : null;
