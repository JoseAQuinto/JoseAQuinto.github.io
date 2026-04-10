import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarIcon,
    ClockIcon,
    QueueListIcon,
    CheckBadgeIcon,
    CircleStackIcon,
    BoltIcon,
    InformationCircleIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    PlayIcon,
} from "@heroicons/react/24/outline";

import { supportOperationsService } from "./productionMonitoringService";
import type {
    SupportCase,
    SupportStatusType,
    SupportSummary,
    SupportTimelineState,
} from "./productionMonitoring.types";
import {
    STATUS_COLORS,
    CASE_COLORS,
    minutesToHHmm,
    parseLocalDateTime,
    getCaseProgress,
    clampPercent,
    getDayBounds,
    isToday,
} from "./productionMonitoring.utils";
import { useLanguage } from "../../../../translations/LanguageContext";

type TimelineSegment = {
    name: string;
    y: number;
    color: string;
    legendKey?: string;
    showInLegend?: boolean;
    linkedTo?: string;
    caseId?: number;
    channel?: string;
    startLabel?: string;
    endLabel?: string;
};

const buildStateTimelineSeries = (
    timelineStates: SupportTimelineState[],
    selectedDate: string,
    labels: {
        noActivity: string;
        offline: string;
        active: string;
        paused: string;
    }
): Highcharts.SeriesOptionsType[] => {
    const { start: dayStart, end: dayEndRaw } = getDayBounds(selectedDate);
    const visibleEnd = isToday(selectedDate) ? new Date() : dayEndRaw;

    const orderedStates = [...timelineStates].sort((a, b) => {
        const aTime = parseLocalDateTime(a.startTime)?.getTime() ?? 0;
        const bTime = parseLocalDateTime(b.startTime)?.getTime() ?? 0;
        return aTime - bTime;
    });

    const labelMap: Record<string, string> = {
        offline: labels.offline,
        active: labels.active,
        paused: labels.paused,
    };

    const segments: TimelineSegment[] = [];
    let currentHour = 0;
    const shownLegendKeys = new Set<string>();

    for (const item of orderedStates) {
        const rawStart = parseLocalDateTime(item.startTime);
        const rawEnd = item.endTime ? parseLocalDateTime(item.endTime) : visibleEnd;

        if (!rawStart || !rawEnd || rawEnd <= rawStart) continue;

        const clippedStart = new Date(Math.max(rawStart.getTime(), dayStart.getTime()));
        const clippedEnd = new Date(Math.min(rawEnd.getTime(), visibleEnd.getTime()));

        if (clippedEnd <= clippedStart) continue;

        const startHour =
            clippedStart.getHours() +
            clippedStart.getMinutes() / 60 +
            clippedStart.getSeconds() / 3600;

        const duration = (clippedEnd.getTime() - clippedStart.getTime()) / 36e5;
        if (duration <= 0) continue;

        if (startHour > currentHour) {
            segments.push({
                name: labels.noActivity,
                y: startHour - currentHour,
                color: "#f5f5f5",
                showInLegend: false,
            });
        }

        const visualType = item.type ?? "offline";
        const legendKey = visualType;
        const isFirstLegend = !shownLegendKeys.has(legendKey);

        segments.push({
            name: labelMap[visualType] ?? visualType,
            y: duration,
            color: STATUS_COLORS[visualType],
            legendKey,
            showInLegend: isFirstLegend,
            linkedTo: isFirstLegend ? undefined : legendKey,
        });

        shownLegendKeys.add(legendKey);
        currentHour = Math.max(currentHour, startHour + duration);
    }

    const visibleTotalHours = (visibleEnd.getTime() - dayStart.getTime()) / 36e5;

    if (currentHour < visibleTotalHours) {
        segments.push({
            name: labels.noActivity,
            y: visibleTotalHours - currentHour,
            color: "#f5f5f5",
            showInLegend: false,
        });
    }

    return [...segments].reverse().map((segment) => ({
        type: "bar",
        name: segment.name,
        data: [segment.y],
        color: segment.color,
        showInLegend: segment.showInLegend ?? false,
        id: segment.showInLegend ? segment.legendKey : undefined,
        linkedTo: segment.linkedTo,
    })) as Highcharts.SeriesOptionsType[];
};

const buildCasesTimelineSeries = (
    cases: SupportCase[],
    selectedDate: string,
    labels: {
        noCase: string;
    },
    locale: string
): Highcharts.SeriesOptionsType[] => {
    const { start: dayStart, end: dayEnd } = getDayBounds(selectedDate);

    const casesWithDates = cases
        .filter((item) => item.startTime)
        .sort((a, b) => {
            const aTime = parseLocalDateTime(a.startTime)?.getTime() ?? 0;
            const bTime = parseLocalDateTime(b.startTime)?.getTime() ?? 0;
            return aTime - bTime;
        });

    const segments: TimelineSegment[] = [];
    let currentHour = 0;

    for (const [index, item] of casesWithDates.entries()) {
        const rawStart = parseLocalDateTime(item.startTime);
        if (!rawStart) continue;

        const rawEnd = item.endTime
            ? parseLocalDateTime(item.endTime)
            : isToday(selectedDate)
                ? new Date()
                : dayEnd;

        if (!rawEnd || rawEnd <= rawStart) continue;

        const visibleStart = new Date(Math.max(rawStart.getTime(), dayStart.getTime()));
        const visibleEnd = new Date(Math.min(rawEnd.getTime(), dayEnd.getTime()));

        if (visibleEnd <= visibleStart) continue;

        const startHour =
            visibleStart.getHours() +
            visibleStart.getMinutes() / 60 +
            visibleStart.getSeconds() / 3600;

        const duration = (visibleEnd.getTime() - visibleStart.getTime()) / 36e5;
        if (duration <= 0) continue;

        if (startHour > currentHour) {
            segments.push({
                name: labels.noCase,
                y: startHour - currentHour,
                color: "#fafafa",
                showInLegend: false,
            });
        }

        const color = CASE_COLORS[index % CASE_COLORS.length];

        segments.push({
            name: `${item.caseTitle} · ${item.channelName}`,
            y: duration,
            color,
            legendKey: `case-${item.id}`,
            showInLegend: true,
            caseId: item.id,
            channel: item.channelName,
            startLabel: visibleStart.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endLabel: visibleEnd.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
            }),
        });

        currentHour = Math.max(currentHour, startHour + duration);
    }

    if (currentHour < 24) {
        segments.push({
            name: labels.noCase,
            y: 24 - currentHour,
            color: "#fafafa",
            showInLegend: false,
        });
    }

    return [...segments].reverse().map((segment) => ({
        type: "bar",
        name: segment.name,
        data: [
            {
                y: segment.y,
                custom: {
                    caseId: segment.caseId,
                    channel: segment.channel,
                    startLabel: segment.startLabel,
                    endLabel: segment.endLabel,
                },
            },
        ],
        color: segment.color,
        showInLegend: segment.showInLegend ?? false,
        id: segment.showInLegend ? segment.legendKey : undefined,
        linkedTo: segment.linkedTo,
    })) as Highcharts.SeriesOptionsType[];
};

const buildBarTimelineOptions = (
    title: string,
    category: string,
    series: Highcharts.SeriesOptionsType[],
    labels: {
        caseLabel: string;
        channelLabel: string;
        scheduleLabel: string;
        noData: string;
    }
): Highcharts.Options => ({
    chart: {
        type: "bar",
        backgroundColor: "transparent",
        height: 120,
        style: { fontFamily: "inherit" },
    },
    title: { text: undefined },
    xAxis: {
        categories: [category],
        visible: false,
    },
    yAxis: {
        title: { text: "" },
        min: 0,
        max: 24,
        tickInterval: 4,
        labels: {
            formatter: function () {
                const val = this.value as number;
                return `${val < 10 ? "0" : ""}${val}:00`;
            },
            style: { color: "#9ca3af", fontWeight: "bold" },
        },
        gridLineWidth: 1,
        gridLineColor: "#e5e7eb",
        gridZIndex: 5,
    },
    legend: {
        enabled: true,
        verticalAlign: "top",
        align: "right",
        itemStyle: { fontSize: "11px", color: "#6b7280" },
    },
    tooltip: {
        headerFormat: `<span style="font-size: 11px">${title}</span><br/>`,
        pointFormatter: function () {
            const custom = (this.options as any).custom ?? {};
            const lines = [`<b>${this.series.name}</b>: ${this.y?.toFixed(2)} h`];

            if (custom.caseId) lines.push(`${labels.caseLabel}: ${custom.caseId}`);
            if (custom.channel) lines.push(`${labels.channelLabel}: ${custom.channel}`);
            if (custom.startLabel || custom.endLabel) {
                lines.push(
                    `${labels.scheduleLabel}: ${custom.startLabel ?? "--:--"} - ${custom.endLabel ?? "--:--"}`
                );
            }

            return lines.join("<br/>");
        },
    },
    plotOptions: {
        bar: {
            stacking: "normal",
            borderWidth: 0,
            pointWidth: 35,
            borderRadius: 2,
        },
    },
    series,
    credits: { enabled: false },
});

const InfoTooltip = ({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) => {
    return (
        <div className={`group relative ${className}`}>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600">
                <InformationCircleIcon className="h-4 w-4" />
            </div>

            <div className="pointer-events-none absolute right-0 top-9 z-50 w-80 max-w-[90vw] whitespace-pre-line rounded-xl border border-gray-200 bg-white p-3 text-left text-xs leading-5 text-gray-600 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                {text}
            </div>
        </div>
    );
};

const ProductionMonitoringPage: React.FC = () => {
    const { t, language } = useLanguage();
    const pageT = t.portfolioDemo.productionMonitoring;
    const locale = language === "es" ? "es-ES" : "en-GB";

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SupportSummary | null>(null);
    const [cases, setCases] = useState<SupportCase[]>([]);
    const [timelineStates, setTimelineStates] = useState<SupportTimelineState[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [showCasesTimeline, setShowCasesTimeline] = useState(false);

    const dateInputRef = useRef<HTMLInputElement>(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const data = await supportOperationsService.getMonitoringData(1, selectedDate);

            setSummary(data.summary);
            setCases(data.cases);
            setTimelineStates(data.timelineStates);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, [selectedDate]);

    const localizedStatusLabels: Record<SupportStatusType, string> = {
        offline: pageT.statusLabels.offline,
        active: pageT.statusLabels.active,
        paused: pageT.statusLabels.paused,
    };

    const currentStatusType: SupportStatusType = summary?.status ?? "offline";
    const currentStatusLabel = localizedStatusLabels[currentStatusType];

    const activeCase = useMemo(() => {
        const active = cases.find((item) => item.status === "active");
        if (active) return active;
        return cases.find((item) => item.status === "queued") ?? null;
    }, [cases]);

    const activeCaseProgress = useMemo(() => {
        if (!activeCase) return 0;
        return getCaseProgress(activeCase);
    }, [activeCase]);

    const mainKpis = useMemo(() => {
        return {
            sla: clampPercent(summary?.kpis.sla ?? 0),
            firstResponse: clampPercent(summary?.kpis.firstResponse ?? 0),
            resolution: clampPercent(summary?.kpis.resolution ?? 0),
            satisfaction: clampPercent(summary?.kpis.satisfaction ?? 0),
        };
    }, [summary]);

    const timelineOptions = useMemo<Highcharts.Options>(() => {
        const stateSeries = buildStateTimelineSeries(timelineStates, selectedDate, {
            noActivity: pageT.timeline.noActivity,
            offline: pageT.statusLabels.offline,
            active: pageT.statusLabels.active,
            paused: pageT.statusLabels.paused,
        });

        return buildBarTimelineOptions(
            pageT.timeline.teamActivity,
            pageT.timeline.statesCategory,
            stateSeries.length > 0
                ? stateSeries
                : [
                    {
                        type: "bar",
                        name: pageT.timeline.noData,
                        data: [24],
                        color: "#f5f5f5",
                        showInLegend: false,
                    },
                ],
            {
                caseLabel: pageT.caseList.caseLabel,
                channelLabel: pageT.caseList.channelLabel,
                scheduleLabel: pageT.caseList.scheduleLabel,
                noData: pageT.timeline.noData,
            }
        );
    }, [timelineStates, selectedDate, pageT]);

    const casesTimelineOptions = useMemo<Highcharts.Options>(() => {
        const caseSeries = buildCasesTimelineSeries(
            cases,
            selectedDate,
            {
                noCase: pageT.timeline.noCase,
            },
            locale
        );

        return buildBarTimelineOptions(
            pageT.timeline.casesByTime,
            pageT.timeline.casesCategory,
            caseSeries.length > 0
                ? caseSeries
                : [
                    {
                        type: "bar",
                        name: pageT.timeline.noCase,
                        data: [24],
                        color: "#fafafa",
                        showInLegend: false,
                    },
                ],
            {
                caseLabel: pageT.caseList.caseLabel,
                channelLabel: pageT.caseList.channelLabel,
                scheduleLabel: pageT.caseList.scheduleLabel,
                noData: pageT.timeline.noData,
            }
        );
    }, [cases, selectedDate, locale, pageT]);

    const mainSlaOptions = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: "pie",
                backgroundColor: "transparent",
                height: 320,
                events: {
                    render: function () {
                        const chart = this;
                        const target = 85;
                        const centerX = chart.plotLeft + chart.plotWidth / 2;
                        const centerY = chart.plotTop + chart.plotHeight * 0.65;
                        const outerRadius = (Math.min(chart.plotWidth, chart.plotHeight) * 1.1) / 2;
                        const innerRadius = outerRadius * 0.85;

                        const angle = -110 + target * 2.2;
                        const rad = ((angle - 90) * Math.PI) / 180;

                        const x1 = centerX + innerRadius * Math.cos(rad);
                        const y1 = centerY + innerRadius * Math.sin(rad);
                        const x2 = centerX + (outerRadius + 10) * Math.cos(rad);
                        const y2 = centerY + (outerRadius + 10) * Math.sin(rad);

                        if ((chart as any).targetLine) {
                            (chart as any).targetLine.destroy();
                        }

                        (chart as any).targetLine = (chart.renderer as any)
                            .path(["M", x1, y1, "L", x2, y2])
                            .attr({
                                stroke: "#1f2937",
                                "stroke-width": 3,
                                zIndex: 10,
                            })
                            .add();
                    },
                },
            },
            title: {
                text: `<div style="text-align:center"><span style="font-size:48px; font-weight:700; color:#1f2937">${Math.round(
                    mainKpis.sla
                )}%</span><br/><span style="font-size:13px; color:#6b7280; font-weight:600">${pageT.mainPanel.globalSla.toUpperCase()}</span></div>`,
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
                    innerSize: "85%",
                    borderWidth: 0,
                },
            },
            series: [
                {
                    type: "pie",
                    data: [
                        {
                            y: Math.round(mainKpis.sla),
                            color: Math.round(mainKpis.sla) >= 85 ? "#059669" : "#3b82f6",
                        },
                        {
                            y: 100 - Math.round(mainKpis.sla),
                            color: "#e5e7eb",
                        },
                    ],
                },
            ],
            credits: { enabled: false },
        };
    }, [mainKpis, pageT.mainPanel.globalSla]);

    const formatLongDateLocal = (value: string) => {
        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(locale, {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatNowTimeLocal = () =>
        new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
        });

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    <p className="text-sm font-medium text-gray-600">{pageT.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-shadow duration-300 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm">
                                <Cog6ToothIcon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                                    {summary?.teamName ?? pageT.header.supportCenter}
                                </h1>

                                <div className="mt-1 flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                        <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                        {isToday(selectedDate) ? pageT.header.today : pageT.header.historical}
                                    </span>

                                    <div
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${currentStatusType === "active"
                                            ? "animate-pulse bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-gray-100 text-gray-600 border border-gray-200"
                                            }`}
                                    >
                                        <div className={`h-2 w-2 rounded-full ${currentStatusType === "active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                                        {currentStatusLabel}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 sm:gap-1">
                            <div
                                className="group relative cursor-pointer"
                                onClick={() => {
                                    if (dateInputRef.current) {
                                        if (typeof (dateInputRef.current as any).showPicker === "function") {
                                            (dateInputRef.current as any).showPicker();
                                        } else {
                                            dateInputRef.current.click();
                                        }
                                    }
                                }}
                            >
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="pointer-events-none absolute inset-0 cursor-pointer opacity-0"
                                />

                                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all group-hover:border-blue-400 group-hover:ring-2 group-hover:ring-blue-100">
                                    <CalendarIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{formatLongDateLocal(selectedDate)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="tabular-nums font-medium">{formatNowTimeLocal()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="mb-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-1 w-5 rounded-full bg-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">{pageT.timeline.dailyActivity}</h2>
                                <InfoTooltip
                                    text={
                                        pageT.timeline.tooltipMain
                                    }
                                />
                            </div>

                            <button
                                onClick={() => setShowCasesTimeline(!showCasesTimeline)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${showCasesTimeline
                                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <QueueListIcon className="h-4 w-4" />
                                {showCasesTimeline ? pageT.timeline.hide : pageT.timeline.breakdownBy} {pageT.timeline.cases}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="h-[120px] overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                <HighchartsReact highcharts={Highcharts} options={timelineOptions} />
                            </div>

                            <AnimatePresence initial={false}>
                                {showCasesTimeline && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="h-[120px] overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={casesTimelineOptions}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 lg:grid-cols-3">
                    <section className="lg:col-span-1">
                        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50/50 px-5 py-4 sm:px-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                            <QueueListIcon className="h-5 w-5 text-gray-400" />
                                            {pageT.caseList.title}
                                        </h3>
                                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            {pageT.caseList.subtitle}
                                        </p>
                                    </div>

                                    <InfoTooltip
                                        text={pageT.caseList.tooltip}
                                    />
                                </div>
                            </div>

                            <div className="custom-scrollbar flex-1 overflow-auto p-4 sm:p-5">
                                <div className="space-y-3">
                                    {cases.length > 0 ? (
                                        cases.map((item) => (
                                            <CaseListItem
                                                key={item.id}
                                                supportCase={item}
                                                labels={pageT.caseList}
                                                locale={locale}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <CircleStackIcon className="mb-3 h-10 w-10 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-500">
                                                {pageT.caseList.empty}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="lg:col-span-2">
                        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-5 py-6 sm:px-6">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                                            {pageT.mainPanel.currentAttention}
                                        </p>

                                        <h3 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                                            {summary?.activeCaseTitle || pageT.mainPanel.noCase}
                                        </h3>

                                        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                            {summary?.activeChannelName || pageT.mainPanel.noChannel}
                                        </p>
                                    </div>

                                    <InfoTooltip
                                        text={pageT.mainPanel.tooltip}
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <TopMetricCard
                                        icon={<ClockIcon className="h-4 w-4 text-amber-600" />}
                                        label={pageT.mainPanel.handover}
                                        value={minutesToHHmm(summary?.handoverMinutes ?? 0)}
                                    />
                                    <TopMetricCard
                                        icon={<BoltIcon className="h-4 w-4 text-blue-600" />}
                                        label={pageT.mainPanel.activeAttention}
                                        value={minutesToHHmm(summary?.activeAttentionMinutes ?? 0)}
                                    />
                                    <TopMetricCard
                                        icon={<CircleStackIcon className="h-4 w-4 text-emerald-600" />}
                                        label={pageT.mainPanel.tickets}
                                        value={`${summary?.resolvedTickets ?? 0} / ${summary?.targetTickets ?? 0}`}
                                        progress={activeCaseProgress}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 p-5 sm:p-6">
                                <div className="space-y-4">
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="flex h-[280px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50/30">
                                            <HighchartsReact highcharts={Highcharts} options={mainSlaOptions} />
                                        </div>

                                        <div className="space-y-3">
                                            <SubKPICard
                                                icon={<ClockIcon className="h-5 w-5" />}
                                                label={pageT.kpis.firstResponse}
                                                value={mainKpis.firstResponse}
                                                tone="blue"
                                                tooltip={pageT.kpis.firstResponseTooltip}
                                                labels={{
                                                    onTarget: pageT.kpis.onTarget,
                                                    belowTarget: pageT.kpis.belowTarget,
                                                }}
                                            />
                                            <SubKPICard
                                                icon={<BoltIcon className="h-5 w-5" />}
                                                label={pageT.kpis.resolution}
                                                value={mainKpis.resolution}
                                                tone="amber"
                                                tooltip={pageT.kpis.resolutionTooltip}
                                                labels={{
                                                    onTarget: pageT.kpis.onTarget,
                                                    belowTarget: pageT.kpis.belowTarget,
                                                }}
                                            />
                                            <SubKPICard
                                                icon={<CheckBadgeIcon className="h-5 w-5" />}
                                                label={pageT.kpis.satisfaction}
                                                value={mainKpis.satisfaction}
                                                tone="emerald"
                                                tooltip={pageT.kpis.satisfactionTooltip}
                                                labels={{
                                                    onTarget: pageT.kpis.onTarget,
                                                    belowTarget: pageT.kpis.belowTarget,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3 border-t border-gray-200 pt-4">
                                        <QuickStateCard
                                            icon={<PlayIcon className="h-4 w-4" />}
                                            title={pageT.quickCards.activeCase}
                                            value={summary?.activeCaseTitle || "--"}
                                            tone="blue"
                                        />
                                        <QuickStateCard
                                            icon={<ExclamationTriangleIcon className="h-4 w-4" />}
                                            title={pageT.quickCards.status}
                                            value={currentStatusLabel}
                                            tone="amber"
                                        />
                                        <QuickStateCard
                                            icon={<CircleStackIcon className="h-4 w-4" />}
                                            title={pageT.quickCards.target}
                                            value={`${summary?.targetTickets ?? 0}`}
                                            tone="emerald"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const CaseListItem = ({
    supportCase,
    labels,
    locale,
}: {
    supportCase: SupportCase;
    labels: {
        active: string;
        resolved: string;
        queued: string;
        inLabel: string;
        outLabel: string;
        slaShort: string;
        firstResponseShort: string;
        resolutionShort: string;
        satisfactionShort: string;
    };
    locale: string;
}) => {
    const isActive = supportCase.status === "active";
    const isResolved = supportCase.status === "resolved";
    const progress = getCaseProgress(supportCase);

    const formatTime = (ts: string | null | undefined) => {
        const date = parseLocalDateTime(ts);
        if (!date) return "--:--";

        return date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className={`rounded-lg border p-3 transition-colors ${isActive
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
        >
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-gray-900">
                        {supportCase.caseTitle}
                    </h4>
                    <p className="mt-0.5 truncate text-xs font-semibold text-gray-500">
                        {supportCase.channelName}
                    </p>
                </div>

                {isActive ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {labels.active}
                    </span>
                ) : isResolved ? (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                        {labels.resolved}
                    </span>
                ) : (
                    <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        {labels.queued}
                    </span>
                )}
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{labels.inLabel}: <span className="text-gray-700">{formatTime(supportCase.startTime)}</span></span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-gray-300">→</span>
                    <span>{labels.outLabel}: <span className="text-gray-700">{formatTime(supportCase.endTime)}</span></span>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-4 gap-2">
                <MiniIndicator label={labels.slaShort} value={supportCase.sla} color="text-blue-600 bg-blue-50" />
                <MiniIndicator label={labels.firstResponseShort} value={supportCase.firstResponse} color="text-red-600 bg-red-50" />
                <MiniIndicator label={labels.resolutionShort} value={supportCase.resolution} color="text-amber-600 bg-amber-50" />
                <MiniIndicator label={labels.satisfactionShort} value={supportCase.satisfaction} color="text-emerald-600 bg-emerald-50" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600">
                        {supportCase.resolvedTickets}{" "}
                        <span className="font-normal opacity-60">/ {supportCase.targetTickets}</span>
                    </span>
                    <span className={isActive ? "text-blue-600" : "text-gray-600"}>
                        {Math.round(progress)}%
                    </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${isActive ? "bg-blue-600" : "bg-gray-400"}`}
                    />
                </div>
            </div>
        </div>
    );
};

const MiniIndicator = ({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) => (
    <div
        className={`flex flex-col items-center justify-center rounded-md border border-transparent py-1 transition-colors ${color}`}
    >
        <span className="text-[8px] font-bold uppercase leading-none opacity-60">
            {label}
        </span>
        <span className="text-xs font-bold leading-none">{Math.round(value)}%</span>
    </div>
);

const TopMetricCard = ({
    icon,
    label,
    value,
    progress,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    progress?: number;
}) => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-white hover:border-gray-300">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600">
            {icon}
            {label}
        </span>

        <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>

        {typeof progress === "number" && (
            <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-emerald-500"
                    />
                </div>
            </div>
        )}
    </div>
);

const SubKPICard = ({
    icon,
    label,
    value,
    tone,
    tooltip,
    labels,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    tone: "blue" | "amber" | "emerald";
    tooltip?: string;
    labels: {
        onTarget: string;
        belowTarget: string;
    };
}) => {
    const toneStyles = {
        blue: {
            iconWrap: "bg-blue-50 text-blue-600 border-blue-200",
            badge: "bg-blue-50 text-blue-700 border-blue-200",
            bar: "bg-blue-600",
        },
        amber: {
            iconWrap: "bg-amber-50 text-amber-600 border-amber-200",
            badge: "bg-amber-50 text-amber-700 border-amber-200",
            bar: "bg-amber-500",
        },
        emerald: {
            iconWrap: "bg-emerald-50 text-emerald-600 border-emerald-200",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            bar: "bg-emerald-600",
        },
    };

    const styles = toneStyles[tone];
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div
            className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
            title={tooltip}
        >
            <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles.iconWrap}`}>
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                {label}
                            </p>
                        </div>

                        <div className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${styles.badge}`}>
                            {Math.round(safeValue)}%
                        </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${safeValue}%` }}
                            transition={{ duration: 0.6 }}
                            className={`h-full rounded-full ${styles.bar}`}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                        <span>
                            {safeValue >= 85 ? labels.onTarget : labels.belowTarget}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickStateCard = ({
    icon,
    title,
    value,
    tone,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    tone: "blue" | "amber" | "emerald";
}) => {
    const tones = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        amber: "bg-amber-50 text-amber-600 border-amber-200",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    };

    return (
        <div className={`rounded-lg border p-3 transition-all hover:shadow-sm ${tones[tone]}`}>
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/50">
                {icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-75">
                {title}
            </p>
            <p className="mt-1 truncate text-sm font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
};

export default ProductionMonitoringPage;