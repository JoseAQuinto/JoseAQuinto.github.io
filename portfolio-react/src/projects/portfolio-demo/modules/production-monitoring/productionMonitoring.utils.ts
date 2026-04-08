import type {
    SupportCase,
    SupportStatusType,
} from "./productionMonitoring.types";

export const STATUS_LABELS: Record<SupportStatusType, string> = {
    active: "Atendiendo",
    waiting: "En espera",
    critical: "Escalado",
    offline: "Sin actividad",
};

export const STATUS_COLORS: Record<SupportStatusType, string> = {
    active: "#10b981",
    waiting: "#f59e0b",
    critical: "#ef4444",
    offline: "#94a3b8",
};

export const STATUS_PILL_STYLES: Record<
    SupportStatusType,
    { container: string; dot: string; text: string }
> = {
    active: {
        container: "bg-emerald-50 border-emerald-100",
        dot: "bg-emerald-500",
        text: "text-emerald-600",
    },
    waiting: {
        container: "bg-amber-50 border-amber-100",
        dot: "bg-amber-500",
        text: "text-amber-600",
    },
    critical: {
        container: "bg-rose-50 border-rose-100",
        dot: "bg-rose-500",
        text: "text-rose-600",
    },
    offline: {
        container: "bg-slate-50 border-slate-100",
        dot: "bg-slate-400",
        text: "text-slate-600",
    },
};

export const CASE_COLORS = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#14b8a6",
    "#f97316",
    "#ec4899",
    "#84cc16",
];

export const safeNumber = (
    value: number | null | undefined
): number =>
    typeof value === "number" && Number.isFinite(value)
        ? value
        : 0;

export const clampPercent = (
    value: number | null | undefined
): number =>
    Math.max(0, Math.min(100, safeNumber(value)));

export const parseLocalDateTime = (
    value?: string | null
): Date | null => {
    if (!value) return null;

    const normalized = value.trim().replace(" ", "T");
    const [datePart, timePart = "00:00:00"] = normalized.split("T");

    const [year, month, day] = datePart.split("-").map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = timePart.split(":").map(Number);

    const date = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds,
        0
    );

    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatNowTime = () =>
    new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });

export const formatLongDate = (dateString: string) => {
    const date = parseLocalDateTime(`${dateString}T00:00:00`);
    if (!date) return dateString;

    return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
};

export const getDayBounds = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const start = new Date(year, month - 1, day, 0, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0, 0);

    return { start, end };
};

export const isToday = (dateString: string) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return dateString === `${yyyy}-${mm}-${dd}`;
};

export function minutesToHHmm(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getCaseProgress(supportCase: SupportCase) {
    if (supportCase.targetTickets <= 0) return 0;

    return Math.max(
        0,
        Math.min(100, (supportCase.resolvedTickets / supportCase.targetTickets) * 100)
    );
}