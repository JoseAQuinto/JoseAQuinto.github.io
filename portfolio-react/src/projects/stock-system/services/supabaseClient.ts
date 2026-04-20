import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Faltan variables de entorno de Supabase");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);