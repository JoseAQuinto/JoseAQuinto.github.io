import Highcharts from "highcharts";
import type {
  CategoryBreakdownItem,
  DateRangeFilter,
  ResourceComparisonItem,
} from "./operationsOverview.types";
import type { Language } from "../../../../translations/types";

export const toInputDate = (value?: string) => {
  if (!value) return undefined;
  return value.slice(0, 10);
};

export const formatMinutes = (value: number | string | null | undefined, language: Language = "en") => {
  const minutes = Number(value);
  if (Number.isNaN(minutes)) return String(value ?? "");

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);

  const dayUnit = language === "es" ? "d" : "d";
  const hourUnit = language === "es" ? "h" : "h";
  const minuteUnit = language === "es" ? "m" : "m";

  return (
    `${days ? `${days}${dayUnit} ` : ""}${hours ? `${hours}${hourUnit} ` : ""}${mins}${minuteUnit}`.trim() ||
    `0${minuteUnit}`
  );
};

export const formatDisplayDate = (value?: string, language: Language = "en") => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  if (language === "es") {
    return `${day}/${month}/${year}`;
  }

  return `${month}/${day}/${year}`;
};

export const getDateFilterLabel = (filter: DateRangeFilter, language: Language = "en") => {
  if (filter.from && filter.to) {
    return `${formatDisplayDate(filter.from, language)} - ${formatDisplayDate(filter.to, language)}`;
  }

  if (filter.from) {
    return language === "es"
      ? `Desde ${formatDisplayDate(filter.from, language)}`
      : `From ${formatDisplayDate(filter.from, language)}`;
  }

  if (filter.to) {
    return language === "es"
      ? `Hasta ${formatDisplayDate(filter.to, language)}`
      : `Until ${formatDisplayDate(filter.to, language)}`;
  }

  return language === "es" ? "Sin filtro de fechas" : "No date filters applied";
};

export const defaultCategoryChartOptions = (language: Language = "en"): Highcharts.Options => ({
  chart: {
    type: "column",
    style: { fontFamily: "inherit" },
    backgroundColor: "transparent",
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
      text: language === "es" ? "Minutos" : "Minutes",
      style: { fontWeight: "bold" },
    },
    labels: { format: "{value}" },
    gridLineDashStyle: "Dash",
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
      type: "column",
      name: language === "es" ? "Minutos" : "Minutes",
      data: [],
    },
  ],
  credits: { enabled: false },
});

export const buildCategoryChartOptions = (
  items: CategoryBreakdownItem[],
  language: Language = "en"
): Highcharts.Options => {
  const categories = items.map((item) => item.label);
  const values = items.map((item) => item.minutes);
  const maxValue = Math.max(...values, 0);

  const baseColors = ["#7c8cf8", "#9fd4ff", "#ffbe7a", "#ff8f8f", "#8fd3a7"];
  const pointColors = values.map((_, idx) => baseColors[idx % baseColors.length]);

  const baseOptions = defaultCategoryChartOptions(language);

  return {
    ...baseOptions,
    xAxis: {
      ...baseOptions.xAxis,
      categories,
    },
    yAxis: {
      ...baseOptions.yAxis,
      max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : undefined,
    },
    series: [
      {
        type: "column",
        name: language === "es" ? "Minutos" : "Minutes",
        data: values,
        colorByPoint: true,
        colors: pointColors,
      },
    ],
  };
};

export const buildResourceComparisonOptions = (
  items: ResourceComparisonItem[],
  language: Language = "en"
): Highcharts.Options => {
  return {
    chart: {
      type: "bar",
      height: 280,
      style: { fontFamily: "inherit" },
      backgroundColor: "transparent",
    },
    title: { text: undefined },
    xAxis: {
      categories: items.map((item) => item.name),
      title: { text: undefined },
    },
    yAxis: {
      min: 0,
      title: {
        text: language === "es" ? "Carga" : "Load",
      },
      gridLineDashStyle: "Dash",
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
        type: "bar",
        name: language === "es" ? "Carga" : "Load",
        data: items.map((item) => ({
          y: item.value,
          color: item.color,
        })),
      },
    ],
    credits: { enabled: false },
  };
};