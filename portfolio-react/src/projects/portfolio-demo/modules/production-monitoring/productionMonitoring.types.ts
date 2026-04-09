export type SupportStatusType =
    | "active"
    | "paused"
    | "offline";

export type SupportKpi = {
    sla: number;
    firstResponse: number;
    resolution: number;
    satisfaction: number;
};

export type SupportSummary = {
    teamId: number;
    teamName: string;
    status: SupportStatusType;
    date: string;

    activeCaseTitle: string | null;
    activeChannelName: string | null;

    handoverMinutes: number;
    activeAttentionMinutes: number;

    resolvedTickets: number;
    targetTickets: number;

    kpis: SupportKpi;
};

export type SupportCase = {
    id: number;
    caseTitle: string;
    channelName: string;

    status: "queued" | "active" | "resolved";

    startTime: string | null;
    endTime: string | null;

    resolvedTickets: number;
    targetTickets: number;

    sla: number;
    firstResponse: number;
    resolution: number;
    satisfaction: number;
};

export type SupportTimelineState = {
    id: number;
    label: string;
    type: SupportStatusType;

    startTime: string;
    endTime: string | null;
};

export type SupportOperationsResponse = {
    summary: SupportSummary;
    cases: SupportCase[];
    timelineStates: SupportTimelineState[];
};