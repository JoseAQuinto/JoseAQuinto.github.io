export const formatDateLabel = (date?: string) => {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB");
};

export const clampPercentage = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};