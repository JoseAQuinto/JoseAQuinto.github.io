import type {
  PerformanceAnalyticsItem,
  PerformanceAnalyticsRequest,
  PerformanceResourceItem,
} from "./performanceAnalytics.types";

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const mockResources: PerformanceResourceItem[] = [
  { id: 1, name: "Assembly Line A" },
  { id: 2, name: "Assembly Line B" },
  { id: 3, name: "Packaging Unit" },
  { id: 4, name: "Inspection Cell" },
];

const generateMockSeries = (
  resourceName: string,
  from?: string,
  to?: string
): PerformanceAnalyticsItem[] => {
  const start = from ? new Date(from) : new Date("2026-03-01");
  const end = to ? new Date(to) : new Date("2026-03-10");

  const rows: PerformanceAnalyticsItem[] = [];
  const current = new Date(start);

  let seed = 0;

  while (current <= end) {
    const availability = 72 + ((seed * 7) % 20);
    const quality = 75 + ((seed * 5) % 18);
    const efficiency = 68 + ((seed * 9) % 22);
    const overallScore = Number(
      ((availability + quality + efficiency) / 3).toFixed(2)
    );

    rows.push({
      date: current.toISOString(),
      resourceName,
      overallScore,
      availability: Number(availability.toFixed(2)),
      quality: Number(quality.toFixed(2)),
      efficiency: Number(efficiency.toFixed(2)),
    });

    current.setDate(current.getDate() + 1);
    seed += 1;
  }

  return rows;
};

export const performanceAnalyticsService = {
  async getResources(): Promise<PerformanceResourceItem[]> {
    await wait(350);
    return mockResources;
  },

  async getDailyPerformance(
    filters: PerformanceAnalyticsRequest
  ): Promise<PerformanceAnalyticsItem[]> {
    await wait(700);

    const selectedResource =
      mockResources.find((item) => item.id === filters.resourceId)?.name ??
      "Unknown Resource";

    return generateMockSeries(selectedResource, filters.from, filters.to);
  },
};