import { hasSupabaseConfig, supabase } from "./supabaseClient";

type UtilityRequest = {
  endpointId: string;
  body: Record<string, unknown>;
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

async function runMockUtility({
  endpointId,
  body,
}: UtilityRequest): Promise<Record<string, unknown>> {
  const text = normalizeText(body.text);

  switch (endpointId) {
    case "uppercase":
      return {
        mode: "mock",
        original: text,
        result: text.toUpperCase(),
        length: text.length,
      };

    case "slugify":
      return {
        mode: "mock",
        original: text,
        slug: slugifyText(text),
      };

    case "count-words":
      return {
        mode: "mock",
        words: countWords(text),
        characters: text.length,
      };

    default:
      throw new Error("Endpoint no soportado en modo mock.");
  }
}

async function runSupabaseUtility({
  endpointId,
  body,
}: UtilityRequest): Promise<Record<string, unknown>> {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase.functions.invoke(endpointId, {
    body,
  });

  if (error) {
    throw new Error(error.message || "Error ejecutando la función en Supabase.");
  }

  return (data ?? {}) as Record<string, unknown>;
}

export async function executeUtility(
  payload: UtilityRequest
): Promise<Record<string, unknown>> {
  if (hasSupabaseConfig) {
    return runSupabaseUtility(payload);
  }

  return runMockUtility(payload);
}