import type { Language } from "../../../../translations/types";

export const formatDateLabel = (date?: string, language: Language = "en") => {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(language === "es" ? "es-ES" : "en-GB");
};

export const clampPercentage = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};