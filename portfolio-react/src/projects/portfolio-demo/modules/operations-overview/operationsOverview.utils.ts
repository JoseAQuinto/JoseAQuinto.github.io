import Highcharts from 'highcharts';
import type { CategoryBreakdownItem, DateRangeFilter, ResourceComparisonItem } from './operationsOverview.types';


export const toInputDate = (value?: string) => {
  if (!value) return undefined;
  return value.slice(0, 10);
};

export const formatMinutes = (value: number | string | null | undefined) => {
  const minutes = Number(value);
  if (Number.isNaN(minutes)) return String(value ?? '');

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);

  return `${days ? `${days}d ` : ''}${hours ? `${hours}h ` : ''}${mins}m`.trim() || '0m';
};

export const formatDisplayDate = (value?: string) => {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

export const getDateFilterLabel = (filter: DateRangeFilter) => {
  if (filter.from && filter.to) {
    return `${formatDisplayDate(filter.from)} - ${formatDisplayDate(filter.to)}`;
  }

  if (filter.from) {
    return `From ${formatDisplayDate(filter.from)}`;
  }

  if (filter.to) {
    return `Until ${formatDisplayDate(filter.to)}`;
  }

  return 'No date filters applied';
};

export const defaultCategoryChartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
    style: { fontFamily: 'inherit' },
    backgroundColor: 'transparent',
  },
  title: { text: undefined },
  xAxis: {
    categories: [],
    lineWidth: 1,
    tickWidth: 0,
    labels: {
      enabled: true,
      rotation: -35,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Minutes',
      style: { fontWeight: 'bold' },
    },
    labels: { format: '{value}' },
    gridLineDashStyle: 'Dash',
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    column: {
      borderRadius: 4,
      borderWidth: 0,
    },
  },
  series: [
    {
      type: 'column',
      name: 'Minutes',
      data: [],
    },
  ],
  credits: { enabled: false },
};

export const buildCategoryChartOptions = (
  items: CategoryBreakdownItem[]
): Highcharts.Options => {
  const categories = items.map((item) => item.label);
  const values = items.map((item) => item.minutes);
  const maxValue = Math.max(...values, 0);

  const baseColors = ['#7c8cf8', '#9fd4ff', '#ffbe7a', '#ff8f8f', '#8fd3a7'];
  const pointColors = values.map((_, idx) => baseColors[idx % baseColors.length]);

  return {
    ...defaultCategoryChartOptions,
    xAxis: {
      ...defaultCategoryChartOptions.xAxis,
      categories,
    },
    yAxis: {
      ...defaultCategoryChartOptions.yAxis,
      max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : undefined,
    },
    series: [
      {
        type: 'column',
        name: 'Minutes',
        data: values,
        colorByPoint: true,
        colors: pointColors,
      },
    ],
  };
};

export const buildResourceComparisonOptions = (
  items: ResourceComparisonItem[]
): Highcharts.Options => {
  return {
    chart: {
      type: 'bar',
      height: 280,
      style: { fontFamily: 'inherit' },
      backgroundColor: 'transparent',
    },
    title: { text: undefined },
    xAxis: {
      categories: items.map((item) => item.name),
      title: { text: undefined },
    },
    yAxis: {
      min: 0,
      title: { text: undefined },
      gridLineDashStyle: 'Dash',
    },
    legend: { enabled: false },
    plotOptions: {
      bar: {
        borderWidth: 0,
        borderRadius: 4,
      },
    },
    series: [
      {
        type: 'bar',
        name: 'Load',
        data: items.map((item) => ({
          y: item.value,
          color: item.color,
        })),
      },
    ],
    credits: { enabled: false },
  };
};