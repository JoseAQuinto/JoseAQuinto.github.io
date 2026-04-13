import { useCallback, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
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
import { useLanguage } from "../../../../translations/LanguageContext";
import FloatingInfoButton from "../../components/FloatingInfoButton";

const PerformanceAnalyticsPage = () => {
  const { t, language } = useLanguage();
  const text = t.portfolioDemo.performanceAnalytics;

  const [rows, setRows] = useState<PerformanceAnalyticsItem[]>([]);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResources, setLoadingResources] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const selectedPoint: PerformanceAnalyticsItem | null =
    rows[selectedIndex] ?? rows[0] ?? null;

  const hasSelectedResource = selectedResource !== null;

  const loadData = useCallback(
    async (filters: PerformanceAnalyticsRequest): Promise<void> => {
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
          setError(text.messages.noDataForFilters);
        }
      } catch (err) {
        console.error("Error loading daily performance", err);
        setRows([]);
        setSelectedIndex(0);
        setError(text.messages.unexpectedError);
      } finally {
        setLoading(false);
      }
    },
    [text.messages.noDataForFilters, text.messages.unexpectedError]
  );

  const loadResources = useCallback(async (): Promise<void> => {
    try {
      setLoadingResources(true);

      const data = await performanceAnalyticsService.getResources();

      const sortedOptions = data
        .map((item) => ({
          label: item.name,
          value: item.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      setResourceOptions(sortedOptions);

      if (sortedOptions.length > 0) {
        const firstResourceId = sortedOptions[0].value;
        setSelectedResource(firstResourceId);

        await loadData({
          resourceId: firstResourceId,
        });
      }
    } catch (err) {
      console.error("Error loading resources", err);
      setResourceOptions([]);
      setSelectedResource(null);
      setRows([]);
      setSelectedIndex(0);
    } finally {
      setLoadingResources(false);
    }
  }, [loadData]);

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const handleApplyFilters = async (): Promise<void> => {
    if (!hasSelectedResource) {
      setRows([]);
      setSelectedIndex(0);
      setError(text.messages.selectResourceBeforeSearch);
      return;
    }

    const filters: PerformanceAnalyticsRequest = {
      resourceId: selectedResource,
    };

    if (fromDate) filters.from = fromDate;
    if (toDate) filters.to = toDate;

    await loadData(filters);
  };

  const handleClearFilters = async (): Promise<void> => {
    setFromDate("");
    setToDate("");
    setRows([]);
    setSelectedIndex(0);
    setError("");

    if (resourceOptions.length > 0) {
      const firstResourceId = resourceOptions[0].value;
      setSelectedResource(firstResourceId);

      await loadData({
        resourceId: firstResourceId,
      });
      return;
    }

    setSelectedResource(null);
  };

  const lineChartOptions: Highcharts.Options = useMemo(() => {
    const categories = rows.map((item) => formatDateLabel(item.date, language));

    const data: Highcharts.PointOptionsObject[] = rows.map((item, idx) => ({
      y: Number(item.overallScore),
      marker: {
        fillColor: idx === selectedIndex ? "#6366f1" : "#ffffff",
        lineColor: "#6366f1",
        lineWidth: 2,
        radius: 5,
      },
    }));

    return {
      chart: {
        type: "area",
        height: 320,
        style: { fontFamily: "'DM Sans', sans-serif" },
        backgroundColor: "transparent",
        spacing: [10, 0, 10, 0],
      },
      title: { text: undefined },
      xAxis: {
        categories,
        gridLineWidth: 1,
        gridLineColor: "#f1f5f9",
        labels: { style: { color: "#94a3b8", fontSize: "11px" } },
        tickWidth: 0,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 20,
        title: { text: undefined },
        labels: {
          format: "{value}%",
          style: { color: "#94a3b8", fontSize: "11px" },
        },
        gridLineColor: "#f1f5f9",
      },
      legend: { enabled: false },
      tooltip: {
        valueSuffix: "%",
        backgroundColor: "#1e293b",
        borderColor: "transparent",
        borderRadius: 8,
        style: { color: "#f8fafc" },
        shadow: true,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(99, 102, 241, 0.18)"],
              [1, "rgba(99, 102, 241, 0)"],
            ],
          },
          marker: { enabled: true },
          lineWidth: 2,
          lineColor: "#6366f1",
          states: { hover: { lineWidth: 3 } },
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
          name: text.charts.overallScoreSeries,
          data,
        },
      ],
      credits: { enabled: false },
    };
  }, [rows, selectedIndex, text.charts.overallScoreSeries, language]);

  const getDonutOptions = useCallback(
    (value: number, color = "#6366f1"): Highcharts.Options => ({
      chart: {
        type: "pie",
        height: 200,
        backgroundColor: "transparent",
      },
      title: {
        text: `<span style="font-size:26px; font-weight:700; color:#0f172a; font-family:'DM Sans',sans-serif">${clampPercentage(
          Number(value ?? 0)
        ).toFixed(1)}%</span>`,
        align: "center",
        verticalAlign: "middle",
        useHTML: true,
        y: 0,
      },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: "78%",
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
            {
              y: Math.max(0, 100 - clampPercentage(Number(value ?? 0))),
              color: "#e2e8f0",
            },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    []
  );

  const overallGaugeOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: 280,
        backgroundColor: "transparent",
      },
      title: {
        text: `<div style="text-align:center; font-family:'DM Sans',sans-serif"><span style="font-size:42px; font-weight:700; color:#0f172a">${clampPercentage(
          Number(selectedPoint?.overallScore ?? 0)
        ).toFixed(
          1
        )}%</span><br/><span style="font-size:11px; letter-spacing:0.1em; color:#94a3b8; font-weight:600; text-transform:uppercase">${text.overallIndicator.scoreLabel
          }</span></div>`,
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
          name: text.charts.overallScoreSeries,
          data: [
            {
              name: text.overallIndicator.scorePartLabel,
              y: clampPercentage(Number(selectedPoint?.overallScore ?? 0)),
              color: "#6366f1",
            },
            {
              name: text.overallIndicator.restPartLabel,
              y: Math.max(
                0,
                100 - clampPercentage(Number(selectedPoint?.overallScore ?? 0))
              ),
              color: "#e2e8f0",
            },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    [
      selectedPoint,
      text.overallIndicator.scoreLabel,
      text.overallIndicator.scorePartLabel,
      text.overallIndicator.restPartLabel,
      text.charts.overallScoreSeries,
    ]
  );

  const scoreBadgeText =
    clampPercentage(Number(selectedPoint?.overallScore ?? 0)) >= 80
      ? text.overallIndicator.excellent
      : clampPercentage(Number(selectedPoint?.overallScore ?? 0)) >= 50
        ? text.overallIndicator.moderate
        : text.overallIndicator.needsAttention;

  return (
    <>
      <FloatingInfoButton
        position="bottom-right"
        title={text.infoModal.title}
        subtitle={text.infoModal.subtitle}
        paragraphs={[
          text.infoModal.description1,
          text.infoModal.description2,
          text.infoModal.description3,
        ]}
        buttonLabel={text.infoModal.confirm}
      />
      <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans text-slate-800">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
              <h1 className="text-[15px] font-bold tracking-tight text-slate-900">
                {text.headerTitle}
              </h1>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {text.dashboardBadge}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-screen-2xl space-y-5 p-6">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-widest text-slate-400">
                {text.filtersTitle}
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-sm text-slate-500">{text.selectedResourceLabel}</span>
                <span className="text-sm font-semibold text-slate-900">
                  {selectedPoint?.resourceName ||
                    resourceOptions.find((o) => o.value === selectedResource)?.label ||
                    text.emptyValue}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {text.fields.resource}
                  </label>
                  <div className="relative">
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
                      className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-sm text-slate-800 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                    >
                      <option value="">{text.fields.selectResource}</option>
                      {resourceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {text.fields.fromDate}
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {text.fields.toDate}
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleApplyFilters}
                    disabled={loading || !hasSelectedResource}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <FunnelIcon className="h-4 w-4 shrink-0" />
                    {text.actions.apply}
                  </button>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleClearFilters}
                    disabled={loading}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <XMarkIcon className="h-4 w-4 shrink-0" />
                    {text.actions.clear}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="font-bold text-slate-900">{text.trend.title}</h2>
                {selectedPoint && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {text.trend.selectedLabel}{" "}
                    <span className="font-semibold text-slate-600">
                      {formatDateLabel(selectedPoint.date, language)}
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={handleApplyFilters}
                disabled={loading || !hasSelectedResource}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                {text.actions.refresh}
              </button>
            </div>

            <div className="p-6">
              {hasSelectedResource && error && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {error}
                </div>
              )}

              {hasSelectedResource && !loading && !rows.length && !error && (
                <div className="mb-4 rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                  {text.messages.noDataForPeriod}
                </div>
              )}

              <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-bold text-slate-900">{text.metrics.title}</h2>
                <p className="mt-0.5 text-xs text-slate-400">{text.metrics.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 p-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  {
                    label: text.metrics.availability,
                    value: Number(selectedPoint?.availability ?? 0),
                    color: "#6366f1",
                  },
                  {
                    label: text.metrics.quality,
                    value: Number(selectedPoint?.quality ?? 0),
                    color: "#8b5cf6",
                  },
                  {
                    label: text.metrics.efficiency,
                    value: Number(selectedPoint?.efficiency ?? 0),
                    color: "#a78bfa",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex flex-col items-center py-4 sm:py-0">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={getDonutOptions(value, color)}
                    />
                    <span className="mt-1 text-sm font-semibold text-slate-700">{label}</span>

                    <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${clampPercentage(value)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-bold text-slate-900">{text.overallIndicator.title}</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {text.overallIndicator.subtitle}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6">
                <HighchartsReact highcharts={Highcharts} options={overallGaugeOptions} />

                <span
                  className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold ${clampPercentage(Number(selectedPoint?.overallScore ?? 0)) >= 80
                      ? "bg-emerald-50 text-emerald-600"
                      : clampPercentage(Number(selectedPoint?.overallScore ?? 0)) >= 50
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-500"
                    }`}
                >
                  {scoreBadgeText}
                </span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default PerformanceAnalyticsPage;