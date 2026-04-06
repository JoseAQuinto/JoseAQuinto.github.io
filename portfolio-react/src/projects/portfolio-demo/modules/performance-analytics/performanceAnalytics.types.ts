export type ResourceOption = {
  label: string;
  value: number;
};

export type PerformanceAnalyticsRequest = {
  resourceId: number;
  from?: string;
  to?: string;
};

export type PerformanceAnalyticsItem = {
  date: string;
  resourceName: string;
  overallScore: number;
  availability: number;
  quality: number;
  efficiency: number;
};

export type PerformanceResourceItem = {
  id: number;
  name: string;
};