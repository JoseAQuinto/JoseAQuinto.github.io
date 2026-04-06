import { useCallback, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import type { ComponentType } from "react";
import {
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { performanceAnalyticsService } from "./performanceAnalyticsService";
import type {
  PerformanceAnalyticsItem,
  PerformanceAnalyticsRequest,
  ResourceOption,
} from "./performanceAnalytics.types";
import {
  clampPercentage,
  formatDateLabel,
} from "./performanceAnalytics.utils";

const HighchartsReact =
  (HighchartsReactModule as unknown as { default?: ComponentType<any> }).default ??
  (HighchartsReactModule as unknown as ComponentType<any>);

const PerformanceAnalyticsPage = () => {
  const [rows, setRows] = useState<PerformanceAnalyticsItem[]>([]);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [error, setError] = useState("");

  const selectedPoint = rows[selectedIndex] ?? rows[0] ?? null;
  const hasSelectedResource = selectedResource !== null;

  const loadResources = useCallback(async () => {
    try {
      setLoadingResources(true);

      const data = await performanceAnalyticsService.getResources();

      setResourceOptions(
        data
          .map((item) => ({
            label: item.name,
            value: item.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    } catch (err) {
      console.error("Error loading resources", err);
      setResourceOptions([]);
    } finally {
      setLoadingResources(false);
    }
  }, []);

  const loadData = useCallback(async (filters: PerformanceAnalyticsRequest) => {
    try {
      setLoading(true);
      setError("");

      const data = await performanceAnalyticsService.getDailyPerformance(filters);

      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setRows(sorted);
      setSelectedIndex(0);

      if (!sorted.length) {
        setError("No data found for the selected filters.");
      }
    } catch (err) {
      console.error("Error loading daily performance", err);
      setRows([]);
      setSelectedIndex(0);
      setError("An unexpected error occurred while loading analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleApplyFilters = async () => {
    if (!hasSelectedResource) {
      setRows([]);
      setSelectedIndex(0);
      setError("Please select a resource before running the search.");
      return;
    }

    const filters: PerformanceAnalyticsRequest = {
      resourceId: selectedResource,
    };

    if (fromDate) {
      filters.from = fromDate;
    }

    if (toDate) {
      filters.to = toDate;
    }

    await loadData(filters);
  };

  const handleClearFilters = () => {
    setSelectedResource(null);
    setFromDate("");
    setToDate("");
    setRows([]);
    setSelectedIndex(0);
    setError("");
  };

  const lineChartOptions: Highcharts.Options = useMemo(() => {
    const categories = rows.map((item) => formatDateLabel(item.date));
    const data = rows.map((item, idx) => ({
      y: Number(item.overallScore),
      marker: {
        fillColor: idx === selectedIndex ? "#2563eb" : "#ffffff",
        lineColor: "#2563eb",
        lineWidth: 2,
        radius: 4,
      },
    }));

    return {
      chart: {
        type: "area",
        height: 350,
        style: { fontFamily: "inherit" },
        backgroundColor: "transparent",
      },
      title: { text: undefined },
      xAxis: {
        categories,
        gridLineWidth: 1,
        gridLineColor: "#f1f5f9",
        labels: {
          style: { color: "#64748b" },
        },
        tickWidth: 0,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 10,
        title: { text: undefined },
        labels: {
          format: "{value}%",
          style: { color: "#64748b" },
        },
        gridLineColor: "#f1f5f9",
      },
      legend: { enabled: false },
      tooltip: {
        valueSuffix: "%",
        shared: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(37, 99, 235, 0.22)"],
              [1, "rgba(37, 99, 235, 0)"],
            ],
          },
          marker: {
            enabled: true,
          },
          lineWidth: 2,
          lineColor: "#2563eb",
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          threshold: null,
        },
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                setSelectedIndex(this.index ?? 0);
              },
            },
          },
        },
      },
      series: [
        {
          type: "area",
          name: "Overall score",
          data,
        },
      ],
      credits: { enabled: false },
    };
  }, [rows, selectedIndex]);

  const getDonutOptions = (
    value: number,
    color = "#0f172a"
  ): Highcharts.Options => ({
    chart: {
      type: "pie",
      height: 220,
      backgroundColor: "transparent",
    },
    title: {
      text: `<div style="text-align:center; margin-top: 15px;"><span style="font-size:30px; font-weight:bold; color:#0f172a">${clampPercentage(
        Number(value ?? 0)
      ).toFixed(1)}%</span></div>`,
      align: "center",
      verticalAlign: "middle",
      useHTML: true,
      y: 0,
    },
    tooltip: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: { enabled: false },
        borderWidth: 0,
        enableMouseTracking: false,
        size: "100%",
      },
    },
    series: [
      {
        type: "pie",
        data: [
          { y: clampPercentage(Number(value ?? 0)), color },
          { y: Math.max(0, 100 - clampPercentage(Number(value ?? 0))), color: "#e2e8f0" },
        ],
      },
    ],
    credits: { enabled: false },
  });

  const overallGaugeOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: 300,
        backgroundColor: "transparent",
      },
      title: {
        text: `<div style="text-align:center"><span style="font-size:46px; font-weight:bold; color:#0f172a">${clampPercentage(
          Number(selectedPoint?.overallScore ?? 0)
        ).toFixed(1)}%</span><br/><span style="font-size:14px; color:#64748b">OVERALL SCORE</span></div>`,
        align: "center",
        verticalAlign: "middle",
        useHTML: true,
        y: 40,
      },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          dataLabels: { enabled: false },
          startAngle: -110,
          endAngle: 110,
          center: ["50%", "65%"],
          size: "110%",
          innerSize: "80%",
          borderWidth: 0,
        },
      },
      series: [
        {
          type: "pie",
          name: "Overall score",
          data: [
            {
              name: "Score",
              y: clampPercentage(Number(selectedPoint?.overallScore ?? 0)),
              color: "#0f172a",
            },
            {
              name: "Rest",
              y: Math.max(
                0,
                100 - clampPercentage(Number(selectedPoint?.overallScore ?? 0))
              ),
              color: "#cbd5e1",
            },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    [selectedPoint]
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans text-slate-800">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Performance Analytics</h1>
        </div>
        <div className="w-[120px]" />
      </header>

      <main className="mx-auto space-y-6 p-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-[260px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected resource
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {selectedPoint?.resourceName ||
                  resourceOptions.find((item) => item.value === selectedResource)?.label ||
                  "No resource selected"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[280px_180px_180px_auto_auto] xl:items-end">
              <div className="flex flex-col space-y-2">
                <label className="text-left text-sm font-semibold text-slate-900">
                  Resource
                </label>
                <select
                  value={selectedResource ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) {
                      setSelectedResource(null);
                      setRows([]);
                      setSelectedIndex(0);
                      setError("");
                      return;
                    }

                    setSelectedResource(Number(value));
                  }}
                  disabled={loadingResources}
                  className="h-[44px] rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
                >
                  <option value="">Select a resource</option>
                  {resourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-left text-sm font-semibold text-slate-900">
                  From date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-[44px] rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-left text-sm font-semibold text-slate-900">
                  To date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-[44px] rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
                />
              </div>

              <button
                onClick={handleApplyFilters}
                disabled={loading || !hasSelectedResource}
                className="flex h-[44px] items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FunnelIcon className="h-4 w-4" />
                Apply
              </button>

              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="flex h-[44px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Performance Trend</h2>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <div>
                Selected date:{" "}
                <span className="font-semibold text-slate-800">
                  {selectedPoint ? formatDateLabel(selectedPoint.date) : "-"}
                </span>
              </div>

              <button
                onClick={handleApplyFilters}
                disabled={loading || !hasSelectedResource}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {!hasSelectedResource && (
            <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Please select a resource before running the search.
            </div>
          )}

          {hasSelectedResource && error && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}

          {hasSelectedResource && !loading && !rows.length && !error && (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No data available.
            </div>
          )}

          <div className="mt-4 w-full">
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-8 text-lg font-bold text-slate-900">
              Performance Metrics
            </h2>

            <div className="grid flex-1 grid-cols-1 items-center gap-6 pb-4 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(Number(selectedPoint?.availability ?? 0), "#0f172a")}
                />
                <span className="mt-2 text-base font-semibold text-slate-700">
                  Availability
                </span>
              </div>

              <div className="flex flex-col items-center">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(Number(selectedPoint?.quality ?? 0), "#0f172a")}
                />
                <span className="mt-2 text-base font-semibold text-slate-700">
                  Quality
                </span>
              </div>

              <div className="flex flex-col items-center">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(Number(selectedPoint?.efficiency ?? 0), "#0f172a")}
                />
                <span className="mt-2 text-base font-semibold text-slate-700">
                  Efficiency
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Overall Indicator
            </h2>

            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="w-full">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={overallGaugeOptions}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalyticsPage;