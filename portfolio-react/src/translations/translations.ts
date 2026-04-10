export const translations = {
    es: {
        common: {
            back: "Volver atrás",
            language: "Cambiar idioma",
            changeLanguageAriaLabel: "Cambiar idioma",
            viewDemo: "Ver demo",
            backToTop: "Volver arriba",
        },

        projectsPage: {
            badge: "Full-stack Developer",
            title: "Jose Ángel Quinto",
            subtitle: "Junior Full-Stack con foco en React",
            intro:
                "1 año de experiencia desarrollando aplicaciones empresariales en entornos profesionales. Especializado en React y backend con .NET.",
            aboutTitle: "Sobre mí",
            projectsTitle: "Proyectos",
            projectsSubtitle:
                "Una selección de demos y proyectos donde muestro estructura, componentes reutilizables e interfaces conectadas a datos mock o APIs.",
            footer: "Jose Ángel Quinto Ferrández · Portafolio",

            techStack: [
                "React",
                "TypeScript",
                "Tailwind",
                ".NET",
                "PostgreSQL",
                "Entity Framework",
            ],

            experience: [
                {
                    title: "Experiencia Actual",
                    description:
                        "Trabajo en una consultora tecnológica desarrollando aplicaciones empresariales (ERP, SGA y MES). Participo en todo el ciclo: desde el diseño de base de datos hasta la interfaz de usuario.",
                },
                {
                    title: "Stack Frontend",
                    description:
                        "React con hooks, Context API, TypeScript y Tailwind. Desarrollo componentes complejos como modales, tablas dinámicas y formularios, conectando con APIs REST propias.",
                },
                {
                    title: "Stack Backend",
                    description:
                        ".NET con Entity Framework, PostgreSQL (joins, migraciones), DTOs y validaciones de negocio. Experiencia en diseño de endpoints REST y flujos de autenticación.",
                },
                {
                    title: "Enfoque Profesional",
                    description:
                        "Busco un rol junior/early-mid centrado en React, con oportunidades para crecer en backend y arquitectura. Me adapto rápido a nuevas tecnologías y entornos de negocio.",
                },
            ],

            projects: [
                {
                    id: "portfolio-demo",
                    title: "Portfolio Demo",
                    description:
                        "Aplicación demo con módulos interactivos de operaciones y analítica. Incluye navegación interna, componentes reutilizables, tipado con TypeScript y servicios mock.",
                    href: "/portfolio-demo",
                    cta: "Ver demo",
                    tags: ["React", "TypeScript", "Tailwind", "Mock API"],
                },
            ],
        },

        portfolioDemo: {
            title: "Portfolio Demo",
            subtitle: "Módulos interactivos de front-end",

            nav: {
                overview: "Resumen",
                performance: "Rendimiento",
                mobileOrders: "Pedidos móvil",
                productionMonitoring: "Seguimiento producción",
            },

            mobileOrdersList: {
                title: "Pedidos",
                subtitle: "Demo de lista móvil",
                clear: "Limpiar",
                filters: "Filtros",
                close: "Cerrar",
                client: "Cliente",
                selectClient: "Seleccionar cliente",
                activeClientFilter: "Filtro de cliente activo",
                filterSheetTitle: "Filtros de pedidos",
            },

            mobileOrderDetail: {
                title: "Detalle del pedido",
                editableSubtitle: "Detalle móvil editable",
                save: "Guardar",
                saving: "Guardando...",
                savedMessage: "Cambios guardados en datos mock",
                notFound: "Pedido no encontrado",

                generalInformationTitle: "Información general",
                generalInformationSubtitle: "Campos básicos editables",

                descriptionTitle: "Descripción",
                descriptionSubtitle: "Contenido editable más largo",
                descriptionPlaceholder: "Describe los detalles de la orden...",

                requiredField: "es obligatorio",

                fields: {
                    orderCode: "Código de pedido",
                    title: "Título",
                    client: "Cliente",
                    location: "Ubicación",
                    date: "Fecha",
                    status: "Estado",
                },

                statusOptions: {
                    pending: "Pendiente",
                    inProgress: "En progreso",
                    completed: "Completado",
                },
            },

            operationsOverview: {
                headerTitle: "Resumen de operaciones",
                dashboardBadge: "Dashboard",
                filtersTitle: "Filtros",
                activeFilterLabel: "Filtro activo:",
                refresh: "Actualizar",
                clear: "Limpiar",
                setDateRange: "Definir rango de fechas",

                modal: {
                    title: "Filtrar por fecha",
                    subtitle: "Aplica un rango personalizado para recargar las métricas del dashboard.",
                    from: "Desde",
                    to: "Hasta",
                    cancel: "Cancelar",
                    apply: "Aplicar filtros",
                },

                kpis: {
                    totalDuration: "Duración total",
                    totalIncidents: "Incidencias totales",
                    averageDuration: "Duración media",
                },

                categoryBreakdown: {
                    title: "Desglose por categoría",
                    subtitle: "Distribución de minutos registrados por categoría.",
                },

                topResources: {
                    title: "Recursos principales",
                    subtitle: "Ordenados por minutos totales de inactividad.",
                    noData: "No hay datos disponibles",
                    columns: {
                        resource: "Recurso",
                        duration: "Duración",
                        reason: "Motivo",
                    },
                },

                resourceComparison: {
                    title: "Comparativa de recursos",
                    subtitle: "Rendimiento comparativo entre recursos.",
                },
            },

            performanceAnalytics: {
                headerTitle: "Analítica de rendimiento",
                dashboardBadge: "Dashboard",
                filtersTitle: "Filtros",

                selectedResourceLabel: "Recurso:",
                emptyValue: "—",

                fields: {
                    resource: "Recurso",
                    selectResource: "Selecciona un recurso…",
                    fromDate: "Fecha desde",
                    toDate: "Fecha hasta",
                },

                actions: {
                    apply: "Aplicar",
                    clear: "Limpiar",
                    refresh: "Actualizar",
                },

                trend: {
                    title: "Tendencia de rendimiento",
                    selectedLabel: "Seleccionado:",
                },

                metrics: {
                    title: "Métricas de rendimiento",
                    subtitle: "Desglose para la fecha seleccionada",
                    availability: "Disponibilidad",
                    quality: "Calidad",
                    efficiency: "Eficiencia",
                },

                overallIndicator: {
                    title: "Indicador general",
                    subtitle: "Puntuación compuesta",
                    scoreLabel: "Puntuación general",
                    scorePartLabel: "Puntuación",
                    restPartLabel: "Resto",
                    excellent: "Excelente",
                    moderate: "Moderado",
                    needsAttention: "Necesita atención",
                },

                charts: {
                    overallScoreSeries: "Puntuación general",
                },

                messages: {
                    noDataForFilters: "No se han encontrado datos para los filtros seleccionados.",
                    unexpectedError: "Se ha producido un error inesperado al cargar los datos analíticos.",
                    selectResourceBeforeSearch: "Selecciona un recurso antes de ejecutar la búsqueda.",
                    selectResourceToView: "Selecciona un recurso para ver los datos de rendimiento.",
                    noDataForPeriod: "No hay datos disponibles para el periodo seleccionado.",
                },
            },

            productionMonitoring: {
                loading: "Cargando datos...",
                statusLabels: {
                    offline: "Sin actividad",
                    active: "Activo",
                    paused: "Pausado",
                    waiting: "En espera",
                    critical: "Crítico",
                },
                header: {
                    supportCenter: "Centro de Soporte",
                    today: "Hoy",
                    historical: "Histórico",
                },
                timeline: {
                    dailyActivity: "Actividad diaria",
                    teamActivity: "Actividad del equipo",
                    casesByTime: "Casos por franja",
                    statesCategory: "Estados",
                    casesCategory: "Casos",
                    noActivity: "Sin actividad",
                    noCase: "Sin caso",
                    noData: "Sin datos",
                    hide: "Ocultar",
                    breakdownBy: "Desglosar por",
                    cases: "Casos",
                    tooltipMain:
                        "Muestra el comportamiento operativo del equipo en la fecha seleccionada.\n\n- La barra principal resume los estados de atención.\n\n- El desglose por casos representa los tramos dedicados a cada incidencia.",
                },
                caseList: {
                    title: "Casos del día",
                    subtitle: "Resumen de atención",
                    tooltip: "Lista de casos del día con sus indicadores principales e información de horario.",
                    empty: "No hay casos registrados para este día",
                    active: "Activo",
                    resolved: "Resuelto",
                    queued: "En cola",
                    inLabel: "In",
                    outLabel: "Out",
                    caseLabel: "Caso",
                    channelLabel: "Canal",
                    scheduleLabel: "Horario",
                    slaShort: "SLA",
                    firstResponseShort: "1ª resp",
                    resolutionShort: "Resol",
                    satisfactionShort: "Sat",
                },
                mainPanel: {
                    currentAttention: "Atención en curso",
                    noCase: "SIN CASO",
                    noChannel: "Sin canal",
                    tooltip: "Caso actualmente en atención con el canal y equipo responsable.",
                    handover: "Traspaso",
                    activeAttention: "Atención activa",
                    tickets: "Tickets",
                    globalSla: "SLA global",
                },
                kpis: {
                    firstResponse: "Primera respuesta",
                    resolution: "Resolución",
                    satisfaction: "Satisfacción",
                    firstResponseTooltip: "% de casos atendidos en tiempo objetivo.",
                    resolutionTooltip: "% de casos cerrados correctamente.",
                    satisfactionTooltip: "Valoración media de satisfacción.",
                    onTarget: "✓ En objetivo",
                    belowTarget: "⚠ Bajo objetivo",
                },
                quickCards: {
                    activeCase: "Caso activo",
                    status: "Estado",
                    target: "Objetivo",
                },
            },
        },
    },

    en: {
        common: {
            back: "Go back",
            language: "Change language",
            changeLanguageAriaLabel: "Change language",
            viewDemo: "View demo",
            backToTop: "Back to top",
        },

        projectsPage: {
            badge: "Full-stack Developer",
            title: "Jose Ángel Quinto",
            subtitle: "Junior Full-Stack focused on React",
            intro:
                "1 year of experience building enterprise applications in professional environments. Specialized in React and backend with .NET.",
            aboutTitle: "About me",
            projectsTitle: "Projects",
            projectsSubtitle:
                "A selection of demos and projects where I showcase structure, reusable components and interfaces connected to mock data or APIs.",
            footer: "Jose Ángel Quinto Ferrández · Portfolio",

            techStack: [
                "React",
                "TypeScript",
                "Tailwind",
                ".NET",
                "PostgreSQL",
                "Entity Framework",
            ],

            experience: [
                {
                    title: "Current Experience",
                    description:
                        "Working at a technology consultancy developing enterprise applications (ERP, WMS and MES). I participate in the full cycle: from database design to user interfaces.",
                },
                {
                    title: "Frontend Stack",
                    description:
                        "React with hooks, Context API, TypeScript and Tailwind. Building complex components like modals, dynamic tables and forms, connecting to in-house REST APIs.",
                },
                {
                    title: "Backend Stack",
                    description:
                        ".NET with Entity Framework, PostgreSQL (joins, migrations), DTOs and business validations. Experience designing REST endpoints and authentication flows.",
                },
                {
                    title: "Professional Focus",
                    description:
                        "Looking for a junior/early-mid role focused on React, with opportunities to grow in backend and architecture. I adapt quickly to new technologies and business environments.",
                },
            ],

            projects: [
                {
                    id: "portfolio-demo",
                    title: "Portfolio Demo",
                    description:
                        "Demo application with interactive operations and analytics modules. Includes internal navigation, reusable components, TypeScript typing and mock services.",
                    href: "/portfolio-demo",
                    cta: "View demo",
                    tags: ["React", "TypeScript", "Tailwind", "Mock API"],
                },
            ],
        },

        portfolioDemo: {
            title: "Portfolio Demo",
            subtitle: "Interactive front-end modules",

            nav: {
                overview: "Overview",
                performance: "Performance",
                mobileOrders: "Mobile Orders",
                productionMonitoring: "Production Monitoring",
            },

            mobileOrdersList: {
                title: "Orders",
                subtitle: "Mobile list demo",
                clear: "Clear",
                filters: "Filters",
                close: "Close",
                client: "Client",
                selectClient: "Select client",
                activeClientFilter: "Active client filter",
                filterSheetTitle: "Order filters",
            },

            mobileOrderDetail: {
                title: "Order detail",
                editableSubtitle: "Editable mobile detail",
                save: "Save",
                saving: "Saving...",
                savedMessage: "Changes saved in mock data",
                notFound: "Order not found",

                generalInformationTitle: "General information",
                generalInformationSubtitle: "Basic editable fields",

                descriptionTitle: "Description",
                descriptionSubtitle: "Longer editable content",
                descriptionPlaceholder: "Describe the order details...",

                requiredField: "is required",

                fields: {
                    orderCode: "Order code",
                    title: "Title",
                    client: "Client",
                    location: "Location",
                    date: "Date",
                    status: "Status",
                },

                statusOptions: {
                    pending: "Pending",
                    inProgress: "In Progress",
                    completed: "Completed",
                },
            },

            operationsOverview: {
                headerTitle: "Operations Overview",
                dashboardBadge: "Dashboard",
                filtersTitle: "Filters",
                activeFilterLabel: "Active filter:",
                refresh: "Refresh",
                clear: "Clear",
                setDateRange: "Set date range",

                modal: {
                    title: "Filter by date",
                    subtitle: "Apply a custom range to reload dashboard metrics.",
                    from: "From",
                    to: "To",
                    cancel: "Cancel",
                    apply: "Apply filters",
                },

                kpis: {
                    totalDuration: "Total duration",
                    totalIncidents: "Total incidents",
                    averageDuration: "Average duration",
                },

                categoryBreakdown: {
                    title: "Category Breakdown",
                    subtitle: "Distribution of tracked minutes by category.",
                },

                topResources: {
                    title: "Top Resources",
                    subtitle: "Ranked by total downtime minutes.",
                    noData: "No data available",
                    columns: {
                        resource: "Resource",
                        duration: "Duration",
                        reason: "Reason",
                    },
                },

                resourceComparison: {
                    title: "Resource Comparison",
                    subtitle: "Comparative performance across resources.",
                },
            },

            performanceAnalytics: {
                headerTitle: "Performance Analytics",
                dashboardBadge: "Dashboard",
                filtersTitle: "Filters",

                selectedResourceLabel: "Resource:",
                emptyValue: "—",

                fields: {
                    resource: "Resource",
                    selectResource: "Select a resource…",
                    fromDate: "From date",
                    toDate: "To date",
                },

                actions: {
                    apply: "Apply",
                    clear: "Clear",
                    refresh: "Refresh",
                },

                trend: {
                    title: "Performance Trend",
                    selectedLabel: "Selected:",
                },

                metrics: {
                    title: "Performance Metrics",
                    subtitle: "Breakdown for selected date",
                    availability: "Availability",
                    quality: "Quality",
                    efficiency: "Efficiency",
                },

                overallIndicator: {
                    title: "Overall Indicator",
                    subtitle: "Composite score",
                    scoreLabel: "Overall Score",
                    scorePartLabel: "Score",
                    restPartLabel: "Rest",
                    excellent: "Excellent",
                    moderate: "Moderate",
                    needsAttention: "Needs attention",
                },

                charts: {
                    overallScoreSeries: "Overall score",
                },

                messages: {
                    noDataForFilters: "No data found for the selected filters.",
                    unexpectedError: "An unexpected error occurred while loading analytics data.",
                    selectResourceBeforeSearch: "Please select a resource before running the search.",
                    selectResourceToView: "Select a resource to view performance data.",
                    noDataForPeriod: "No data available for the selected period.",
                },
            },

            productionMonitoring: {
                loading: "Loading data...",
                statusLabels: {
                    offline: "No activity",
                    active: "Active",
                    paused: "Paused",
                    waiting: "Waiting",
                    critical: "Critical",
                },
                header: {
                    supportCenter: "Support Center",
                    today: "Today",
                    historical: "Historical",
                },
                timeline: {
                    dailyActivity: "Daily Activity",
                    teamActivity: "Team Activity",
                    casesByTime: "Cases by time slot",
                    statesCategory: "States",
                    casesCategory: "Cases",
                    noActivity: "No activity",
                    noCase: "No case",
                    noData: "No data",
                    hide: "Hide",
                    breakdownBy: "Break down by",
                    cases: "Cases",
                    tooltipMain:
                        "Shows the team's operational behavior on the selected date.\n\n- The main bar summarizes attention states.\n\n- The case breakdown represents the time slots dedicated to each incident.",
                },
                caseList: {
                    title: "Cases of the day",
                    subtitle: "Attention summary",
                    tooltip: "List of the day's cases with their main indicators and schedule information.",
                    empty: "There are no registered cases for this day",
                    active: "Active",
                    resolved: "Resolved",
                    queued: "Queued",
                    inLabel: "In",
                    outLabel: "Out",
                    caseLabel: "Case",
                    channelLabel: "Channel",
                    scheduleLabel: "Schedule",
                    slaShort: "SLA",
                    firstResponseShort: "1st resp",
                    resolutionShort: "Res",
                    satisfactionShort: "Sat",
                },
                mainPanel: {
                    currentAttention: "Current attention",
                    noCase: "NO CASE",
                    noChannel: "No channel",
                    tooltip: "Case currently being handled with the responsible channel and team.",
                    handover: "Handover",
                    activeAttention: "Active attention",
                    tickets: "Tickets",
                    globalSla: "Global SLA",
                },
                kpis: {
                    firstResponse: "First response",
                    resolution: "Resolution",
                    satisfaction: "Satisfaction",
                    firstResponseTooltip: "% of cases answered within target time.",
                    resolutionTooltip: "% of cases correctly closed.",
                    satisfactionTooltip: "Average satisfaction rating.",
                    onTarget: "✓ On target",
                    belowTarget: "⚠ Below target",
                },
                quickCards: {
                    activeCase: "Active case",
                    status: "Status",
                    target: "Target",
                },
            },
        },
    },
} as const;