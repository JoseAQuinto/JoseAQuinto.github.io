import { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { operationsOverviewService } from './operationsOverviewService';
import type {
  DateRangeFilter,
  ResourceRankingItem,
} from './operationsOverview.types';
import {
  buildCategoryChartOptions,
  buildResourceComparisonOptions,
  formatMinutes,
  getDateFilterLabel,
  toInputDate,
} from './operationsOverview.utils';

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
  const [from, setFrom] = useState(initialFrom ?? '');
  const [to, setTo] = useState(initialTo ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Filter by date</h3>
            <p className="mt-1 text-sm text-slate-500">
              Apply a custom range to reload dashboard metrics.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onApply(from || undefined, to || undefined)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}

function OperationsOverviewPage() {
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

  const filterLabel = useMemo(() => getDateFilterLabel(dateFilter), [dateFilter]);

  const loadDashboardData = async (filter?: DateRangeFilter) => {
    try {
      setIsLoading(true);

      const data = await operationsOverviewService.getDashboard(filter);

      setTotalDurationMinutes(Number(data?.kpi?.totalDurationMinutes ?? 0));
      setIncidentCount(Number(data?.kpi?.incidentCount ?? 0));
      setAverageDurationMinutes(Number(data?.kpi?.averageDurationMinutes ?? 0));
      setRanking(Array.isArray(data?.ranking) ? data.ranking : []);
      setCategoryChartOptions(buildCategoryChartOptions(data?.categoryBreakdown ?? []));
      setResourceChartOptions(buildResourceComparisonOptions(data?.resourceComparison ?? []));
    } catch (error) {
      console.error('Failed to load operations overview:', error);
      setTotalDurationMinutes(0);
      setIncidentCount(0);
      setAverageDurationMinutes(0);
      setRanking([]);
      setCategoryChartOptions(buildCategoryChartOptions([]));
      setResourceChartOptions(buildResourceComparisonOptions([]));
    } finally {
      setIsLoading(false);
    }
  };

  const applyDateFilter = async (from?: string, to?: string) => {
    const nextFilter = { from, to };
    setDateFilter(nextFilter);
    await loadDashboardData(nextFilter);
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
        console.error('Failed to initialize operations overview:', error);
        await loadDashboardData();
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 md:p-6">
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

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Operations Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Interactive front-end demo with mock data and simulated API requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                <FunnelIcon className="h-5 w-5 text-slate-600" />
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Active filter
                </div>
                <div className="truncate text-sm font-medium text-slate-700">{filterLabel}</div>
              </div>

              {(dateFilter.from || dateFilter.to) && (
                <button
                  onClick={async () => {
                    setDateFilter({});
                    await loadDashboardData();
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <button
                onClick={() => loadDashboardData(dateFilter)}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-50"
                title="Refresh data"
              >
                <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-50"
                title="Open filters"
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <ClockIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-4xl font-bold tracking-tight text-slate-900">
                  {totalDurationMinutes}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-500">
                  Total duration (minutes)
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                  <ChartBarIcon className="h-6 w-6 text-rose-500" />
                </div>
                <div className="text-4xl font-bold tracking-tight text-slate-900">
                  {incidentCount}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-500">
                  Total incidents
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                  <ClockIcon className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-4xl font-bold tracking-tight text-slate-900">
                  {averageDurationMinutes}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-500">
                  Average duration
                </div>
              </div>
            </div>

            <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">Category Breakdown</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mock distribution of tracked minutes by category.
                </p>
              </div>

              <div className="h-[320px]">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={categoryChartOptions}
                  containerProps={{ style: { height: '100%' } }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">Top Resources</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ranking generated from mock analytics data.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Resource</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ranking.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      ranking.map((item, index) => (
                        <tr
                          key={`${item.resourceName}-${index}`}
                          className="border-t border-slate-100"
                        >
                          <td className="px-4 py-4 font-medium text-slate-800">
                            {item.resourceName}
                          </td>
                          <td className="px-4 py-4">
                            {formatMinutes(item.downtimeMinutes)}
                          </td>
                          <td className="px-4 py-4">{item.primaryReason}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">Resource Comparison</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Example chart for comparative performance.
                </p>
              </div>

              <HighchartsReact highcharts={Highcharts} options={resourceChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationsOverviewPage;