import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { operationsOverviewService } from "./operationsOverviewService";
import type { DateRangeFilter, ResourceRankingItem } from "./operationsOverview.types";
import {
  buildCategoryChartOptions,
  buildResourceComparisonOptions,
  formatMinutes,
  getDateFilterLabel,
  toInputDate,
} from "./operationsOverview.utils";
import { useLanguage } from "../../../../translations/LanguageContext";
import FloatingInfoButton from "../../components/FloatingInfoButton";

/* ── Date range modal ─────────────────────────────────────────────── */

function DateRangeModal({
  initialFrom,
  initialTo,
  onApply,
  onCancel,
}: {
  initialFrom?: string;
  initialTo?: string;
  onApply: (from?: string, to?: string) => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const pageT = t.portfolioDemo.operationsOverview;

  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">{pageT.modal.title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{pageT.modal.subtitle}</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <XMarkIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {pageT.modal.from}
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {pageT.modal.to}
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97]"
          >
            {pageT.modal.cancel}
          </button>
          <button
            type="button"
            onClick={() => onApply(from || undefined, to || undefined)}
            className="flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97]"
          >
            <FunnelIcon className="h-4 w-4" />
            {pageT.modal.apply}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── KPI card ─────────────────────────────────────────────────────── */

function KpiCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1.5 text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */

function OperationsOverviewPage() {
  const { t, language } = useLanguage();
  const pageT = t.portfolioDemo.operationsOverview;

  const [totalDurationMinutes, setTotalDurationMinutes] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [averageDurationMinutes, setAverageDurationMinutes] = useState(0);
  const [ranking, setRanking] = useState<ResourceRankingItem[]>([]);
  const [categoryChartOptions, setCategoryChartOptions] =
    useState<Highcharts.Options>(buildCategoryChartOptions([]));
  const [resourceChartOptions, setResourceChartOptions] =
    useState<Highcharts.Options>(buildResourceComparisonOptions([]));
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterLabel = useMemo(
    () => getDateFilterLabel(dateFilter, language),
    [dateFilter, language]
  );
  const hasActiveFilter = !!(dateFilter.from || dateFilter.to);

  const loadDashboardData = async (filter?: DateRangeFilter) => {
    try {
      setIsLoading(true);
      const data = await operationsOverviewService.getDashboard(filter);
      setTotalDurationMinutes(Number(data?.kpi?.totalDurationMinutes ?? 0));
      setIncidentCount(Number(data?.kpi?.incidentCount ?? 0));
      setAverageDurationMinutes(Number(data?.kpi?.averageDurationMinutes ?? 0));
      setRanking(Array.isArray(data?.ranking) ? data.ranking : []);
      setCategoryChartOptions(
        buildCategoryChartOptions(data?.categoryBreakdown ?? [], language)
      );
      setResourceChartOptions(
        buildResourceComparisonOptions(data?.resourceComparison ?? [], language)
      );
    } catch (error) {
      console.error("Failed to load operations overview:", error);
      setTotalDurationMinutes(0);
      setIncidentCount(0);
      setAverageDurationMinutes(0);
      setRanking([]);
      setCategoryChartOptions(buildCategoryChartOptions([], language));
      setResourceChartOptions(buildResourceComparisonOptions([], language));
    } finally {
      setIsLoading(false);
    }
  };

  const applyDateFilter = async (from?: string, to?: string) => {
    const nextFilter = { from, to };
    setDateFilter(nextFilter);
    await loadDashboardData(nextFilter);
  };

  const clearFilter = async () => {
    setDateFilter({});
    await loadDashboardData();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const savedFilters = await operationsOverviewService.getSavedFilters();
        if (savedFilters?.from || savedFilters?.to) {
          const initialFilter: DateRangeFilter = {
            from: toInputDate(savedFilters.from),
            to: toInputDate(savedFilters.to),
          };
          setDateFilter(initialFilter);
          await loadDashboardData(initialFilter);
          return;
        }
        await loadDashboardData();
      } catch (error) {
        console.error("Failed to initialize operations overview:", error);
        await loadDashboardData();
      }
    };
    init();
  }, [language]);

  return (
    <>
      <FloatingInfoButton
        position="bottom-right"
        title={pageT.infoModal.title}
        subtitle={pageT.infoModal.subtitle}
        paragraphs={[
          pageT.infoModal.description1,
          pageT.infoModal.description2,
          pageT.infoModal.description3,
        ]}
        buttonLabel={pageT.infoModal.confirm}
      />
      <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans text-slate-800">
        {isFilterOpen && (
          <DateRangeModal
            initialFrom={dateFilter.from}
            initialTo={dateFilter.to}
            onApply={async (from, to) => {
              await applyDateFilter(from, to);
              setIsFilterOpen(false);
            }}
            onCancel={() => setIsFilterOpen(false)}
          />
        )}

        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
              <h1 className="text-[15px] font-bold tracking-tight text-slate-900">
                {pageT.headerTitle}
              </h1>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {pageT.dashboardBadge}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-screen-2xl space-y-5 p-6">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-widest text-slate-400">
                {pageT.filtersTitle}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-sm text-slate-500">{pageT.activeFilterLabel}</span>
                <span className="text-sm font-semibold text-slate-900">{filterLabel}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => loadDashboardData(dateFilter)}
                  disabled={isLoading}
                  className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 shrink-0 ${isLoading ? "animate-spin" : ""}`} />
                  {pageT.refresh}
                </button>

                {hasActiveFilter && (
                  <button
                    onClick={clearFilter}
                    disabled={isLoading}
                    className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XMarkIcon className="h-4 w-4 shrink-0" />
                    {pageT.clear}
                  </button>
                )}

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97]"
                >
                  <FunnelIcon className="h-4 w-4 shrink-0" />
                  {pageT.setDateRange}
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                  icon={<ClockIcon className="h-5 w-5" />}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-500"
                  value={formatMinutes(totalDurationMinutes)}
                  label={pageT.kpis.totalDuration}
                />
                <KpiCard
                  icon={<ChartBarIcon className="h-5 w-5" />}
                  iconBg="bg-rose-50"
                  iconColor="text-rose-500"
                  value={incidentCount}
                  label={pageT.kpis.totalIncidents}
                />
                <KpiCard
                  icon={<ClockIcon className="h-5 w-5" />}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-500"
                  value={formatMinutes(averageDurationMinutes)}
                  label={pageT.kpis.averageDuration}
                />
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-slate-900">{pageT.categoryBreakdown.title}</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {pageT.categoryBreakdown.subtitle}
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-[320px]">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={categoryChartOptions}
                      containerProps={{ style: { height: "100%" } }}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-5">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-slate-900">{pageT.topResources.title}</h2>
                  <p className="mt-0.5 text-xs text-slate-400">{pageT.topResources.subtitle}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {pageT.topResources.columns.resource}
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {pageT.topResources.columns.duration}
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {pageT.topResources.columns.reason}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-400">
                            {pageT.topResources.noData}
                          </td>
                        </tr>
                      ) : (
                        ranking.map((item, index) => (
                          <tr
                            key={`${item.resourceName}-${index}`}
                            className="border-t border-slate-100 transition hover:bg-slate-50/60"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                  {index + 1}
                                </span>
                                <span className="font-medium text-slate-800">{item.resourceName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">
                              {formatMinutes(item.downtimeMinutes)}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500">{item.primaryReason}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-slate-900">{pageT.resourceComparison.title}</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {pageT.resourceComparison.subtitle}
                  </p>
                </div>
                <div className="p-6">
                  <HighchartsReact highcharts={Highcharts} options={resourceChartOptions} />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default OperationsOverviewPage;