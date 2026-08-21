import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_STOCK_SUPABASE_URL as string | undefined;

const supabasePublishableKey = import.meta.env
  .VITE_STOCK_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * DESACTIVADO INTENCIONALMENTE PARA EL PORTFOLIO
 *
 * La integración original con Supabase se conserva en este archivo y en los
 * servicios para que pueda revisarse fácilmente. El portfolio publicado usa
 * exclusivamente almacenamiento local y nunca crea una conexión remota,
 * aunque existan las variables VITE_STOCK_SUPABASE_*.
 *
 * Para restaurar el backend real en una copia del proyecto, cambia esta
 * constante a `true` y configura las variables de entorno anteriores.
 */
const SUPABASE_CONNECTION_ENABLED = false;

export const hasSupabaseEnv = Boolean(
  SUPABASE_CONNECTION_ENABLED && supabaseUrl && supabasePublishableKey
);

export const supabase: SupabaseClient | null = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabasePublishableKey!)
  : null;
