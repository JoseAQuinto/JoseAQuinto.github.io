import type { SupportOperationsResponse } from "./productionMonitoring.types";

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const supportOperationsService = {
    async getMonitoringData(
        teamId: number,
        date: string
    ): Promise<SupportOperationsResponse> {
        await delay(700);

        return {
            summary: {
                teamId,
                teamName: "Mesa de Soporte Premium",
                status: "active",
                date,

                activeCaseTitle: "INC-2026-1842 · Error de acceso al portal",
                activeChannelName: "Chat y Correo",

                handoverMinutes: 30,
                activeAttentionMinutes: 285,

                resolvedTickets: 148,
                targetTickets: 190,

                kpis: {
                    sla: 82,
                    firstResponse: 88,
                    resolution: 84,
                    satisfaction: 97,
                },
            },

            cases: [
                {
                    id: 1842,
                    caseTitle: "INC-2026-1842 · Error de acceso al portal",
                    channelName: "Chat y Correo",
                    status: "active",
                    startTime: `${date} 08:15:00`,
                    endTime: null,
                    resolvedTickets: 148,
                    targetTickets: 190,
                    sla: 82,
                    firstResponse: 88,
                    resolution: 84,
                    satisfaction: 97,
                },
                {
                    id: 1841,
                    caseTitle: "REQ-2026-1841 · Alta de usuario corporativo",
                    channelName: "Correo",
                    status: "resolved",
                    startTime: `${date} 06:40:00`,
                    endTime: `${date} 08:00:00`,
                    resolvedTickets: 42,
                    targetTickets: 42,
                    sla: 91,
                    firstResponse: 93,
                    resolution: 89,
                    satisfaction: 99,
                },
                {
                    id: 1843,
                    caseTitle: "INC-2026-1843 · Revisión de permisos compartidos",
                    channelName: "Backoffice",
                    status: "queued",
                    startTime: `${date} 15:30:00`,
                    endTime: `${date} 18:00:00`,
                    resolvedTickets: 0,
                    targetTickets: 18,
                    sla: 0,
                    firstResponse: 0,
                    resolution: 0,
                    satisfaction: 0,
                },
            ],

            timelineStates: [
                {
                    id: 1,
                    label: "Atendiendo",
                    type: "active",
                    startTime: `${date} 08:15:00`,
                    endTime: null,
                },
                {
                    id: 2,
                    label: "En espera",
                    type: "offline",
                    startTime: `${date} 08:00:00`,
                    endTime: `${date} 08:15:00`,
                },
                {
                    id: 3,
                    label: "Atendiendo",
                    type: "active",
                    startTime: `${date} 07:00:00`,
                    endTime: `${date} 08:00:00`,
                },
                {
                    id: 4,
                    label: "Escalado",
                    type: "active",
                    startTime: `${date} 06:40:00`,
                    endTime: `${date} 07:00:00`,
                },
                {
                    id: 5,
                    label: "Sin actividad",
                    type: "offline",
                    startTime: `${date} 00:00:00`,
                    endTime: `${date} 06:40:00`,
                },
            ],
        };
    },
};