import type { DateRangeFilter, OperationsOverviewResponse, SavedFilters } from "./operationsOverview.types";


const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const buildMockResponse = (filter?: DateRangeFilter): OperationsOverviewResponse => {
  const hasFilter = Boolean(filter?.from || filter?.to);

  return {
    kpi: {
      totalDurationMinutes: hasFilter ? 1280 : 1845,
      incidentCount: hasFilter ? 18 : 27,
      averageDurationMinutes: hasFilter ? 71 : 68,
    },
    ranking: [
      {
        resourceName: 'Assembly Line A',
        downtimeMinutes: hasFilter ? 420 : 590,
        primaryReason: 'Calibration',
      },
      {
        resourceName: 'Packaging Cell',
        downtimeMinutes: hasFilter ? 280 : 430,
        primaryReason: 'Material delay',
      },
      {
        resourceName: 'Inspection Bench',
        downtimeMinutes: hasFilter ? 215 : 305,
        primaryReason: 'Manual review',
      },
      {
        resourceName: 'Sorting Unit',
        downtimeMinutes: hasFilter ? 165 : 240,
        primaryReason: 'Sensor reset',
      },
    ],
    categoryBreakdown: [
      { label: 'Calibration', minutes: hasFilter ? 310 : 460 },
      { label: 'Material Delay', minutes: hasFilter ? 275 : 390 },
      { label: 'Setup', minutes: hasFilter ? 240 : 330 },
      { label: 'Inspection', minutes: hasFilter ? 210 : 295 },
      { label: 'Maintenance', minutes: hasFilter ? 160 : 240 },
    ],
    resourceComparison: [
      { name: 'Line A', value: 78, color: '#7c8cf8' },
      { name: 'Line B', value: 61, color: '#9fd4ff' },
      { name: 'Line C', value: 43, color: '#ffbe7a' },
      { name: 'Line D', value: 35, color: '#8fd3a7' },
    ],
  };
};

export const operationsOverviewService = {
  async getDashboard(filter?: DateRangeFilter): Promise<OperationsOverviewResponse> {
    await wait(600);
    return buildMockResponse(filter);
  },

  async getSavedFilters(): Promise<SavedFilters> {
    await wait(250);

    return {
      from: undefined,
      to: undefined,
    };
  },
};