export type DateRangeFilter = {
  from?: string;
  to?: string;
};

export interface OverviewKpi {
  totalDurationMinutes: number;
  incidentCount: number;
  averageDurationMinutes: number;
}

export interface CategoryBreakdownItem {
  label: string;
  minutes: number;
}

export interface ResourceRankingItem {
  resourceName: string;
  downtimeMinutes: number;
  primaryReason: string;
}

export interface ResourceComparisonItem {
  name: string;
  value: number;
  color?: string;
}

export interface SavedFilters {
  from?: string;
  to?: string;
}

export interface OperationsOverviewResponse {
  kpi: OverviewKpi;
  ranking: ResourceRankingItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  resourceComparison: ResourceComparisonItem[];
}