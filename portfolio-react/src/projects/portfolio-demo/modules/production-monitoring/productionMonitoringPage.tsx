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
    STATUS_LABELS,
    STATUS_PILL_STYLES,
    CASE_COLORS,
    minutesToHHmm,
    parseLocalDateTime,
    getCaseProgress,
    clampPercent,
    formatLongDate,
    formatNowTime,
    getDayBounds,
    isToday,
} from "./productionMonitoring.utils";

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
    selectedDate: string
): Highcharts.SeriesOptionsType[] => {
    const { start: dayStart, end: dayEndRaw } = getDayBounds(selectedDate);
    const visibleEnd = isToday(selectedDate) ? new Date() : dayEndRaw;

    const orderedStates = [...timelineStates].sort((a, b) => {
        const aTime = parseLocalDateTime(a.startTime)?.getTime() ?? 0;
        const bTime = parseLocalDateTime(b.startTime)?.getTime() ?? 0;
        return aTime - bTime;
    });

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
                name: "Sin actividad",
                y: startHour - currentHour,
                color: "#f1f5f9",
                showInLegend: false,
            });
        }

        const visualType = item.type ?? "offline";
        const legendKey = visualType;
        const isFirstLegend = !shownLegendKeys.has(legendKey);

        segments.push({
            name: STATUS_LABELS[visualType],
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
            name: "Sin actividad",
            y: visibleTotalHours - currentHour,
            color: "#f1f5f9",
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
    selectedDate: string
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
                name: "Sin caso",
                y: startHour - currentHour,
                color: "#f8fafc",
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
            startLabel: visibleStart.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endLabel: visibleEnd.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        });

        currentHour = Math.max(currentHour, startHour + duration);
    }

    if (currentHour < 24) {
        segments.push({
            name: "Sin caso",
            y: 24 - currentHour,
            color: "#f8fafc",
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
    series: Highcharts.SeriesOptionsType[]
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
            style: { color: "#94a3b8", fontWeight: "bold" },
        },
        gridLineWidth: 1.5,
        gridLineColor: "#cbd5e1",
        gridZIndex: 5,
    },
    legend: {
        enabled: true,
        verticalAlign: "top",
        align: "right",
        itemStyle: { fontSize: "10px", color: "#64748b" },
    },
    tooltip: {
        headerFormat: `<span style="font-size: 10px">${title}</span><br/>`,
        pointFormatter: function () {
            const custom = (this.options as any).custom ?? {};
            const lines = [`<b>${this.series.name}</b>: ${this.y?.toFixed(2)} h`];

            if (custom.caseId) lines.push(`Caso: ${custom.caseId}`);
            if (custom.channel) lines.push(`Canal: ${custom.channel}`);
            if (custom.startLabel || custom.endLabel) {
                lines.push(`Tramo: ${custom.startLabel ?? "--:--"} - ${custom.endLabel ?? "--:--"}`);
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
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600">
                <InformationCircleIcon className="h-4 w-4" />
            </div>

            <div className="pointer-events-none absolute left-0 top-9 z-50 w-80 max-w-[90vw] whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs leading-5 text-slate-600 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100">
                {text}
            </div>
        </div>
    );
};

const ProductionMonitoringPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SupportSummary | null>(null);
    const [cases, setCases] = useState<SupportCase[]>([]);
    const [timelineStates, setTimelineStates] = useState<SupportTimelineState[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [showCasesTimeline, setShowCasesTimeline] = useState(false);

    const dateInputRef = useRef<HTMLInputElement>(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const data = await supportOperationsService.getMonitoringData(
                1,
                selectedDate
            );

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

    const currentStatusType: SupportStatusType = summary?.status ?? "offline";
    const currentStatusStyles = STATUS_PILL_STYLES[currentStatusType];
    const currentStatusLabel = STATUS_LABELS[currentStatusType];

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
        const stateSeries = buildStateTimelineSeries(timelineStates, selectedDate);

        return buildBarTimelineOptions(
            "Actividad del equipo",
            "Estados",
            stateSeries.length > 0
                ? stateSeries
                : [
                    {
                        type: "bar",
                        name: "Sin datos",
                        data: [24],
                        color: "#f1f5f9",
                        showInLegend: false,
                    },
                ]
        );
    }, [timelineStates, selectedDate]);

    const casesTimelineOptions = useMemo<Highcharts.Options>(() => {
        const caseSeries = buildCasesTimelineSeries(cases, selectedDate);

        return buildBarTimelineOptions(
            "Casos por franja",
            "Casos",
            caseSeries.length > 0
                ? caseSeries
                : [
                    {
                        type: "bar",
                        name: "Sin caso",
                        data: [24],
                        color: "#f8fafc",
                        showInLegend: false,
                    },
                ]
        );
    }, [cases, selectedDate]);

    const mainSlaOptions = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: "pie",
                backgroundColor: "transparent",
                height: 360,
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
                                stroke: "#0f172a",
                                "stroke-width": 3,
                                zIndex: 10,
                            })
                            .add();
                    },
                },
            },
            title: {
                text: `<div style="text-align:center"><span style="font-size:48px; font-weight:bold; color:#0f172a">${Math.round(
                    mainKpis.sla
                )}%</span><br/><span style="font-size:14px; color:#64748b; font-weight:bold">SLA GLOBAL</span></div>`,
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
                            color: Math.round(mainKpis.sla) >= 85 ? "#10b981" : "#3b82f6",
                        },
                        {
                            y: 100 - Math.round(mainKpis.sla),
                            color: "#f1f5f9",
                        },
                    ],
                },
            ],
            credits: { enabled: false },
        };
    }, [mainKpis]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1800px]">
                <div className="sticky top-0 z-10 mb-8 flex flex-col gap-5 bg-[#f8fafc]/85 py-2 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4 sm:items-center sm:gap-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                            <Cog6ToothIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">
                                <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                    {summary?.teamName ?? "Centro de Soporte"}
                                </h1>

                                <div
                                    className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1 shadow-sm ${currentStatusStyles.container} ${currentStatusType === "active" ? "animate-pulse" : ""}`}
                                >
                                    <div className={`h-2 w-2 rounded-full ${currentStatusStyles.dot}`} />
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-widest ${currentStatusStyles.text}`}
                                    >
                                        {currentStatusLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <CalendarIcon className="h-4 w-4" />
                                    {isToday(selectedDate) ? "Actual" : "Histórico"}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Support Desk
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start lg:justify-end">
                        <div className="flex flex-col items-start gap-1 lg:items-end">
                            <div
                                className="group relative flex cursor-pointer items-center justify-end"
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

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm ring-offset-2 transition-colors group-hover:border-blue-400 group-hover:ring-2 group-hover:ring-blue-100">
                                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-700">
                                        {formatLongDate(selectedDate)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-0.5 flex items-center gap-1.5 text-slate-400 lg:pr-2">
                                <ClockIcon className="h-4 w-4" />
                                <span className="tabular-nums text-xs font-medium">
                                    {formatNowTime()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8 overflow-visible rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-center gap-2.5">
                            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
                                <div className="h-6 w-1 rounded-full bg-blue-600" />
                                Actividad Diaria
                            </h2>

                            <InfoTooltip
                                text={
                                    "Muestra el comportamiento operativo del equipo en la fecha seleccionada.\n\n" +
                                    "- La barra principal resume los estados de atención.\n\n" +
                                    "- El desglose por casos representa los tramos temporales dedicados a cada incidencia."
                                }
                            />
                        </div>

                        <button
                            onClick={() => setShowCasesTimeline(!showCasesTimeline)}
                            className={`flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${showCasesTimeline
                                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <QueueListIcon className="h-4 w-4" />
                            {showCasesTimeline ? "Ocultar Casos" : "Desglosar por Casos"}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="h-[120px]">
                            <HighchartsReact highcharts={Highcharts} options={timelineOptions} />
                        </div>

                        <AnimatePresence initial={false}>
                            {showCasesTimeline && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden border-t border-slate-100 pt-4"
                                >
                                    <div className="h-[120px]">
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={casesTimelineOptions}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 xl:col-span-4"
                    >
                        <div className="flex min-h-[620px] flex-col overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/30 p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                            <QueueListIcon className="h-5 w-5 text-slate-500" />
                                            Casos del día
                                        </h3>
                                        <p className="mt-0.5 text-xs font-semibold tracking-wide text-slate-400">
                                            RESUMEN DE ATENCIÓN
                                        </p>
                                    </div>

                                    <InfoTooltip
                                        text="Lista los casos asociados al día seleccionado junto con sus indicadores principales."
                                    />
                                </div>
                            </div>

                            <div className="custom-scrollbar flex-1 overflow-auto p-4">
                                <div className="space-y-4">
                                    {cases.length > 0 ? (
                                        cases.map((item) => (
                                            <CaseListItem key={item.id} supportCase={item} />
                                        ))
                                    ) : (
                                        <div className="py-20 text-center">
                                            <CircleStackIcon className="mx-auto mb-3 h-10 w-10 text-slate-200" />
                                            <p className="font-medium text-slate-400">
                                                No hay casos registrados para este día
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 xl:col-span-8"
                    >
                        <div className="relative flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="relative z-10 border-b border-slate-50 bg-white p-6 sm:p-8">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-start 2xl:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-3 flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
                                                        Atención en curso
                                                    </p>

                                                    <h3 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                                        {summary?.activeCaseTitle || "SIN CASO ACTIVO"}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-500">
                                                        {summary?.activeChannelName || "Sin canal asignado"}
                                                    </p>
                                                </div>

                                                <InfoTooltip
                                                    text="Bloque central con el caso activo, el canal actual y los indicadores principales del equipo."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3 2xl:gap-5">
                                        <TopMetricCard
                                            icon={<ClockIcon className="h-4 w-4 text-amber-500" />}
                                            label="Traspaso"
                                            value={minutesToHHmm(summary?.handoverMinutes ?? 0)}
                                            suffix="h:mm"
                                        />
                                        <TopMetricCard
                                            icon={<BoltIcon className="h-4 w-4 text-blue-500" />}
                                            label="Atención activa"
                                            value={minutesToHHmm(summary?.activeAttentionMinutes ?? 0)}
                                            suffix="h:mm"
                                        />
                                        <TopMetricCard
                                            icon={<CircleStackIcon className="h-4 w-4 text-emerald-500" />}
                                            label="Tickets resueltos"
                                            value={`${summary?.resolvedTickets ?? 0}`}
                                            suffix={`/ ${summary?.targetTickets ?? 0}`}
                                            progress={activeCaseProgress}
                                            progressColor="bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-center bg-slate-50/30 p-6 sm:p-8">
                                <div className="grid grid-cols-1 items-center gap-8 2xl:grid-cols-5 2xl:gap-10">
                                    <div className="relative flex h-[320px] w-full items-center justify-center 2xl:col-span-2">
                                        <HighchartsReact highcharts={Highcharts} options={mainSlaOptions} />
                                    </div>

                                    <div className="space-y-4 2xl:col-span-3">
                                        <SubKPICard
                                            icon={<ClockIcon className="h-5 w-5" />}
                                            label="Primera respuesta"
                                            value={mainKpis.firstResponse}
                                            color="from-rose-500 to-rose-400"
                                            tooltip="Porcentaje de casos atendidos dentro del tiempo objetivo inicial."
                                        />
                                        <SubKPICard
                                            icon={<BoltIcon className="h-5 w-5" />}
                                            label="Resolución"
                                            value={mainKpis.resolution}
                                            color="from-amber-500 to-amber-400"
                                            tooltip="Porcentaje de casos cerrados correctamente dentro del objetivo."
                                        />
                                        <SubKPICard
                                            icon={<CheckBadgeIcon className="h-5 w-5" />}
                                            label="Satisfacción"
                                            value={mainKpis.satisfaction}
                                            color="from-emerald-500 to-emerald-400"
                                            tooltip="Valoración media de satisfacción del usuario final."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                    <QuickStateCard
                                        icon={<PlayIcon className="h-5 w-5" />}
                                        title="Caso activo"
                                        value={summary?.activeCaseTitle || "--"}
                                        tone="blue"
                                    />
                                    <QuickStateCard
                                        icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                                        title="Estado actual"
                                        value={currentStatusLabel}
                                        tone="amber"
                                    />
                                    <QuickStateCard
                                        icon={<CircleStackIcon className="h-5 w-5" />}
                                        title="Objetivo diario"
                                        value={`${summary?.targetTickets ?? 0} tickets`}
                                        tone="emerald"
                                    />
                                </div>
                            </div>

                            <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />
                            <div className="pointer-events-none absolute -bottom-30 -left-30 h-60 w-60 rounded-full bg-emerald-500/5 blur-[80px]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const CaseListItem = ({ supportCase }: { supportCase: SupportCase }) => {
    const isActive = supportCase.status === "active";
    const isResolved = supportCase.status === "resolved";
    const progress = getCaseProgress(supportCase);

    const formatTime = (ts: string | null | undefined) => {
        const date = parseLocalDateTime(ts);
        if (!date) return "--:--";

        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className={`group rounded-2xl border p-4 transition-all hover:shadow-md ${isActive ? "border-blue-200 bg-blue-50/40" : "border-slate-100 bg-white"
                }`}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold uppercase text-slate-800 transition-colors group-hover:text-blue-700">
                        {supportCase.caseTitle}
                    </h4>
                    <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {supportCase.channelName}
                    </p>
                </div>

                {isActive ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        activo
                    </span>
                ) : isResolved ? (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-500">
                        Resuelto
                    </span>
                ) : (
                    <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-black uppercase italic text-slate-300">
                        En cola
                    </span>
                )}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3 text-slate-300" />
                    <span>
                        In: <span className="text-slate-700">{formatTime(supportCase.startTime)}</span>
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-0.5 w-2 bg-slate-200" />
                    <span>
                        Out: <span className="text-slate-700">{formatTime(supportCase.endTime)}</span>
                    </span>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-4 gap-2">
                <MiniIndicator label="SLA" value={supportCase.sla} color="text-blue-600 bg-blue-50" />
                <MiniIndicator label="1ª resp" value={supportCase.firstResponse} color="text-rose-600 bg-rose-50" />
                <MiniIndicator label="Resol" value={supportCase.resolution} color="text-amber-600 bg-amber-50" />
                <MiniIndicator label="Sat" value={supportCase.satisfaction} color="text-emerald-600 bg-emerald-50" />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black">
                    <span className="tracking-tight text-slate-400">
                        {supportCase.resolvedTickets}{" "}
                        <span className="text-[10px] font-medium opacity-50">/ {supportCase.targetTickets}</span>
                    </span>
                    <span className={isActive ? "font-extrabold text-blue-600" : "text-slate-500"}>
                        {Math.round(progress)}%
                    </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full rounded-full ${isActive
                                ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                : "bg-slate-300"
                            }`}
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
        className={`flex flex-col items-center justify-center rounded-lg border border-transparent py-1 transition-colors hover:border-current/10 ${color}`}
    >
        <span className="mb-0.5 text-[8px] font-black uppercase leading-none tracking-tighter opacity-70">
            {label}
        </span>
        <span className="text-[10px] font-black leading-none">{Math.round(value)}%</span>
    </div>
);

const TopMetricCard = ({
    icon,
    label,
    value,
    suffix,
    progress,
    progressColor = "bg-emerald-500",
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    suffix?: string;
    progress?: number;
    progressColor?: string;
}) => (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-white hover:shadow-sm">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {icon}
            {label}
        </span>

        <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-black tracking-tighter text-slate-800">{value}</span>
            {suffix ? (
                <span className="pb-0.5 text-[10px] font-bold uppercase text-slate-400">{suffix}</span>
            ) : null}
        </div>

        {typeof progress === "number" ? (
            <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full transition-all duration-1000 ${progressColor}`}
                        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    />
                </div>
            </div>
        ) : null}
    </div>
);

const SubKPICard = ({
    icon,
    label,
    value,
    color,
    tooltip,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    tooltip?: string;
}) => (
    <div
        className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md"
        title={tooltip}
    >
        <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
            {icon}
        </div>
        <div className="flex-1">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                {label}
            </span>
            <div className="flex items-end justify-between gap-4">
                <span className="text-xl font-black text-slate-900">{Math.round(value)}%</span>
                <div className="mb-2 h-1.5 w-24 max-w-[40%] overflow-hidden rounded-full bg-slate-200 sm:w-32">
                    <div
                        className={`h-full bg-gradient-to-r ${color}`}
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                    />
                </div>
            </div>
        </div>
    </div>
);

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
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                {title}
            </p>
            <p className="mt-1 text-sm font-black tracking-tight text-slate-800">
                {value}
            </p>
        </div>
    );
};

export default ProductionMonitoringPage;