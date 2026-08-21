import { apiUtilitiesTranslations } from "../translations/translations";
import { hasSupabaseConfig, supabase } from "./supabaseClient";

type UtilityRequest = {
  endpointId: string;
  body: Record<string, unknown>;
};

function getCurrentTranslations() {
  const savedLanguage = localStorage.getItem("language");
  const language = savedLanguage === "es" ? "es" : "en";
  return apiUtilitiesTranslations[language];
}

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
  const t = getCurrentTranslations();
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
      throw new Error(t.unsupportedMockEndpoint);
  }
}

async function runSupabaseUtility({
  endpointId,
  body,
}: UtilityRequest): Promise<Record<string, unknown>> {
  // Original Edge Function integration retained for repository visitors.
  // It is intentionally unreachable in the public frontend-only demo.
  const t = getCurrentTranslations();

  if (!supabase) {
    throw new Error(t.supabaseNotConfigured);
  }

  const { data, error } = await supabase.functions.invoke(endpointId, {
    body,
  });

  if (error) {
    throw new Error(error.message || t.supabaseFunctionExecutionError);
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
