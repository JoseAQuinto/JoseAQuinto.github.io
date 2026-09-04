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
            skipToContent: "Saltar al contenido",
            viewSelectedWork: "Ver proyectos seleccionados",
            availabilityLabel: "Disponibilidad",
            availabilityText:
                "Abierto a oportunidades frontend y full-stack con foco en producto.",
            experienceLabel: "Años de experiencia",
            selectedProjectsLabel: "Proyectos",
            aboutTitle: "Sobre mí",
            projectsTitle: "Proyectos",
            projectsSubtitle:
                "Una selección de demos y proyectos donde muestro estructura, componentes reutilizables e interfaces conectadas a datos mock o APIs.",
            operationalProjectsNavLabel: "Proyectos operativos",
            operationalProjectsEyebrow: "En producción",
            operationalProjectsTitle: "Proyectos operativos",
            operationalProjectsSubtitle:
                "Aplicaciones propias publicadas, disponibles para uso real y mantenidas como productos en evolución.",
            operationalProjectsOnlineLabel: "En línea",
            operationalProjectsTechLabel: "Tecnologías",
            operationalProjectsCta: "Abrir aplicación",

            featuredEyebrow: "Proyecto destacado",
            featuredNavLabel: "Arcadia WMS",
            featuredProject: {
                title: "Arcadia WMS",
                kicker: "Sistema de gestión de almacenes",
                statusLabel: "En producción",
                description:
                    "Aplicación full-stack completa para gestionar un almacén real: entradas de proveedor, preparación de pedidos, movimientos internos entre ubicaciones, regularizaciones de inventario y trazabilidad total del stock. Frontend en React con TypeScript, API serverless sobre Vercel Functions y PostgreSQL en Neon.",
                highlights: [
                    {
                        title: "Integridad del stock garantizada",
                        description:
                            "Cada operación ocurre dentro de una transacción de PostgreSQL con bloqueo de fila y de documento. El stock nunca puede quedar negativo, y un doble clic no aplica la operación dos veces.",
                    },
                    {
                        title: "Trazabilidad completa",
                        description:
                            "Todo cambio de stock genera un movimiento en un histórico inmutable con artículo, cantidad, origen, destino, usuario y documento asociado. El stock siempre cuadra con ese histórico.",
                    },
                    {
                        title: "Autenticación con roles",
                        description:
                            "Sesiones JWT con perfiles ADMIN y OPERATOR verificados en el backend en cada petición, no solo ocultando botones en la interfaz.",
                    },
                    {
                        title: "Mapa visual del almacén",
                        description:
                            "Vista por zonas con estado y porcentaje de ocupación calculados en tiempo real, ubicaciones bloqueadas y detalle del contenido de cada hueco.",
                    },
                ],
                tags: [
                    "React",
                    "TypeScript",
                    "Tailwind",
                    "Vercel Functions",
                    "PostgreSQL",
                    "Neon",
                    "Drizzle ORM",
                    "JWT",
                    "Zod",
                ],
                demoHref: "https://arcadia-wms.vercel.app",
                demoCta: "Abrir aplicación",
                codeHref: "https://github.com/JoseAQuinto/ArcadiaWMS",
                codeCta: "Ver código",
                credentialsLabel: "Acceso de demostración",
                credentialsValue: "admin / Admin123!",
            },
            footer: "Jose Ángel Quinto Ferrández · Portafolio",

            heroAsideTitle: "Enfoque",
            heroAsideText:
                "Interfaces en React, arquitectura frontend y demos funcionales con intención real de producto.",
            heroBottomNote:
                "Interfaces minimalistas, demos reales y trabajo frontend con sensibilidad de producto.",

            aboutSectionNote:
                "Una selección de capacidades, forma de trabajo y enfoque técnico presentada con el mismo nivel de contención que el resto del portfolio.",
            aboutDetailLabel: "Detalle",

            projectsEyebrow: "Selected work",
            projectMetaLabel: "Listo para producción",
            projectMetaSubLabel: "Demo funcional real",
            projectYear: "2026",
            projectSideDescription:
                "UI cuidada, estructura real y un lenguaje visual sobrio alineado con trabajo de producto.",
            projectFootnote: "Demo funcional de portfolio",

            techStackTitle: "Stack",

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
                    id: "visual-planner",
                    title: "Visual Planner",
                    description:
                        "Organizador mensual interactivo con gestión de tareas, backlog, filtros y drag & drop. Construido completamente con HTML, CSS y JavaScript vanilla y persistencia local.",
                    href: "/visual-planner/index.html",
                    cta: "Ver demo",
                    standalone: true,
                    tags: ["HTML", "CSS", "JavaScript", "LocalStorage", "Drag & Drop"],
                },
                {
                    id: "portfolio-demo",
                    title: "Portfolio Demo",
                    description:
                        "Aplicación demo con módulos interactivos de operaciones y analítica. Incluye navegación interna, componentes reutilizables, tipado con TypeScript y servicios mock.",
                    href: "/portfolio-demo",
                    cta: "Ver demo",
                    tags: ["React", "TypeScript", "Tailwind", "Mock API"],
                },
                {
                    id: "stock-system",
                    title: "Stock System",
                    description:
                        "Sistema de stock con React, TypeScript y Supabase. Incluye filtros, tabla, alta, edición, borrado y configuración visual persistente.",
                    tags: ["React", "TypeScript", "Supabase", "Stock"],
                    href: "/stock-system",
                    cta: "Ver proyecto",
                },
                {
                    id: "api-utilities",
                    title: "API Utilities",
                    description:
                        "Módulo visual estilo Swagger para documentar y probar utilidades API con React y Supabase. Incluye ejemplos de peticiones, respuestas JSON y una estructura preparada para Edge Functions.",
                    tags: ["React", "TypeScript", "Supabase", "API", "Swagger UI"],
                    href: "/api-utilities",
                    cta: "Ver proyecto",
                },
            ],
            operationalProjects: [
                {
                    id: "es-estafa",
                    title: "¿Es Estafa?",
                    description:
                        "Aplicación web pública que analiza señales habituales de phishing y estafa en correos, SMS, WhatsApp y otros mensajes sospechosos, ofreciendo un resultado de riesgo explicable y recomendaciones prácticas.",
                    href: "https://esestafaa.netlify.app/",
                    tags: ["Next.js", "TypeScript", "Supabase", "Seguridad"],
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

            introModal: {
                title: "Antes de ver la demo",
                description1:
                    "Estas pantallas son ejemplos inspirados en interfaces y flujos en los que he trabajado durante mi experiencia profesional.",
                description2:
                    "Los datos, nombres, lógica concreta y parte de la estructura han sido adaptados o inventados para este portfolio. No representan exactamente el código ni la información real de la empresa, con el fin de respetar la confidencialidad y la propiedad intelectual.",
                confirm: "Entendido",
                close: "Cerrar modal",
            },

            mobileOrdersList: {

                infoModal: {
                    title: "Listado móvil de pedidos",
                    subtitle: "Vista de navegación rápida",
                    description1:
                        "Esta pantalla está planteada como una demo de listado móvil orientada a consulta rápida, con especial atención a la legibilidad, el espaciado y la jerarquía visual.",
                    description2:
                        "El objetivo es mostrar cómo diseño interfaces táctiles para flujos operativos, facilitando la lectura del estado, cliente, ubicación y acceso al detalle de cada elemento.",
                    description3:
                        "Los datos están adaptados para portfolio, pero la estructura del listado, el comportamiento de filtrado y el enfoque de experiencia están pensados como una pantalla real de producto.",
                    confirm: "Entendido",
                    openAriaLabel: "Abrir información de la página",
                },
                title: "Pedidos",
                subtitle: "Demo de lista móvil",
                clear: "Limpiar",
                filters: "Filtros",
                close: "Cerrar",
                client: "Cliente",
                selectClient: "Seleccionar cliente",
                activeClientFilter: "Filtro de cliente activo",
                filterSheetTitle: "Filtros de pedidos",
                hideCompleted: "Ocultar completados",
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

                //infoModal

                infoModal: {
                    title: "Resumen de operaciones",
                    subtitle: "Vista general del panel",
                    description1:
                        "Esta demo representa un panel de seguimiento operativo orientado a mostrar indicadores clave, rankings y gráficos de actividad en una interfaz clara y estructurada.",
                    description2:
                        "El objetivo de esta pantalla es enseñar cómo presento métricas, filtros y visualizaciones de datos en un entorno de producto, manteniendo una jerarquía visual limpia y componentes reutilizables.",
                    description3:
                        "Los datos y parte de la lógica están simulados o adaptados para portfolio, pero el enfoque de diseño, organización de información y experiencia de uso está planteado como una interfaz real.",
                    confirm: "Entendido",
                    openAriaLabel: "Abrir información de la página",
                },

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
                infoModal: {
                    title: "Analítica de rendimiento",
                    subtitle: "Seguimiento visual de métricas",
                    description1:
                        "Esta demo muestra una pantalla de analítica orientada a consultar la evolución del rendimiento de un recurso a lo largo del tiempo mediante filtros, gráficos y métricas resumidas.",
                    description2:
                        "El objetivo es enseñar cómo estructuro interfaces de lectura analítica, combinando selección de recurso, rango de fechas, tendencia temporal y visualizaciones comparables en una misma vista.",
                    description3:
                        "Los datos están adaptados para portfolio, pero la jerarquía, el enfoque de experiencia y la composición del panel están planteados como una pantalla real de producto.",
                    confirm: "Entendido",
                    openAriaLabel: "Abrir información de la página",
                },
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
                infoModal: {
                    title: "Seguimiento de producción",
                    subtitle: "Monitorización operativa en tiempo real",
                    description1:
                        "Esta demo representa una pantalla de monitorización operativa centrada en mostrar el estado actual del servicio, la actividad del día y la evolución de los casos en una única vista.",
                    description2:
                        "El objetivo es enseñar cómo organizo interfaces de supervisión con timelines, indicadores clave, tarjetas de estado y listados conectados a un contexto temporal claro y fácil de interpretar.",
                    description3:
                        "Los datos y parte de la lógica han sido adaptados para portfolio, pero la jerarquía visual, el enfoque de seguimiento y la composición general están planteados como una interfaz real de producto.",
                    confirm: "Entendido",
                    openAriaLabel: "Abrir información de la página",
                },
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
            skipToContent: "Skip to content",
            viewSelectedWork: "View selected projects",
            availabilityLabel: "Availability",
            availabilityText:
                "Open to frontend and full-stack product-focused opportunities.",
            experienceLabel: "Years of experience",
            selectedProjectsLabel: "Projects",
            aboutTitle: "About me",
            projectsTitle: "Projects",
            projectsSubtitle:
                "A selection of demos and projects where I showcase structure, reusable components and interfaces connected to mock data or APIs.",
            operationalProjectsNavLabel: "Live projects",
            operationalProjectsEyebrow: "In production",
            operationalProjectsTitle: "Live projects",
            operationalProjectsSubtitle:
                "Published applications available for real-world use and maintained as evolving products.",
            operationalProjectsOnlineLabel: "Online",
            operationalProjectsTechLabel: "Technologies",
            operationalProjectsCta: "Open application",

            featuredEyebrow: "Featured project",
            featuredNavLabel: "Arcadia WMS",
            featuredProject: {
                title: "Arcadia WMS",
                kicker: "Warehouse Management System",
                statusLabel: "In production",
                description:
                    "A complete full-stack application for running a real warehouse: supplier receipts, order picking, internal transfers between locations, inventory adjustments and full stock traceability. React frontend with TypeScript, serverless API on Vercel Functions and PostgreSQL on Neon.",
                highlights: [
                    {
                        title: "Guaranteed stock integrity",
                        description:
                            "Every operation runs inside a PostgreSQL transaction with row and document locking. Stock can never go negative, and a double click never applies the same operation twice.",
                    },
                    {
                        title: "Full traceability",
                        description:
                            "Every stock change writes a movement to an immutable ledger with item, quantity, source, destination, user and source document. Stock always reconciles against that ledger.",
                    },
                    {
                        title: "Role-based authentication",
                        description:
                            "JWT sessions with ADMIN and OPERATOR roles enforced in the backend on every request, not just by hiding buttons in the interface.",
                    },
                    {
                        title: "Visual warehouse map",
                        description:
                            "Zone view with status and occupancy percentage computed in real time, blocked locations and the contents of every slot.",
                    },
                ],
                tags: [
                    "React",
                    "TypeScript",
                    "Tailwind",
                    "Vercel Functions",
                    "PostgreSQL",
                    "Neon",
                    "Drizzle ORM",
                    "JWT",
                    "Zod",
                ],
                demoHref: "https://arcadia-wms.vercel.app",
                demoCta: "Open application",
                codeHref: "https://github.com/JoseAQuinto/ArcadiaWMS",
                codeCta: "View code",
                credentialsLabel: "Demo access",
                credentialsValue: "admin / Admin123!",
            },
            footer: "Jose Ángel Quinto Ferrández · Portfolio",

            heroAsideTitle: "Focus",
            heroAsideText:
                "React interfaces, frontend architecture and functional demos with real product intent.",
            heroBottomNote:
                "Minimal interfaces, real demos and frontend work with product sensibility.",

            aboutSectionNote:
                "A selection of capabilities, working style and technical focus presented with the same level of restraint as the rest of the portfolio.",
            aboutDetailLabel: "Detail",

            projectsEyebrow: "Selected work",
            projectMetaLabel: "Production Ready",
            projectMetaSubLabel: "Real functional demo",
            projectYear: "2026",
            projectSideDescription:
                "Clean UI, real structure and a restrained visual language aligned with product work.",
            projectFootnote: "Functional portfolio demo",

            techStackTitle: "Stack",

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
                    id: "visual-planner",
                    title: "Visual Planner",
                    description:
                        "Interactive monthly organizer with task management, backlog, filters and drag & drop. Built entirely with HTML, CSS and vanilla JavaScript with local persistence.",
                    href: "/visual-planner/index.html",
                    cta: "View demo",
                    standalone: true,
                    tags: ["HTML", "CSS", "JavaScript", "LocalStorage", "Drag & Drop"],
                },
                {
                    id: "portfolio-demo",
                    title: "Portfolio Demo",
                    description:
                        "Demo application with interactive operations and analytics modules. Includes internal navigation, reusable components, TypeScript typing and mock services.",
                    href: "/portfolio-demo",
                    cta: "View demo",
                    tags: ["React", "TypeScript", "Tailwind", "Mock API"],
                },
                {
                    id: "stock-system",
                    title: "Stock System",
                    description:
                        "Stock management system built with React, TypeScript and Supabase. Includes filters, tables, create, edit and delete flows, plus persistent visual settings.",
                    tags: ["React", "TypeScript", "Supabase", "Stock"],
                    href: "/stock-system",
                    cta: "View project",
                },
                {
                    id: "api-utilities",
                    title: "API Utilities",
                    description:
                        "Swagger-inspired interface for documenting and testing API utilities with React and Supabase. Includes request examples, JSON responses and an Edge Functions-ready structure.",
                    tags: ["React", "TypeScript", "Supabase", "API", "Swagger UI"],
                    href: "/api-utilities",
                    cta: "View project",
                },
            ],
            operationalProjects: [
                {
                    id: "es-estafa",
                    title: "Is It a Scam?",
                    description:
                        "A public web application that analyzes common phishing and scam signals in emails, SMS, WhatsApp and other suspicious messages, providing an explainable risk result and practical recommendations.",
                    href: "https://esestafaa.netlify.app/",
                    tags: ["Next.js", "TypeScript", "Supabase", "Security"],
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

            introModal: {
                title: "Before viewing the demo",
                description1:
                    "These screens are sample pages inspired by interfaces and workflows I worked on during my professional experience.",
                description2:
                    "The data, names, specific logic, and part of the structure have been adapted or fictionalized for this portfolio. They do not represent the exact code or real company information, in order to respect confidentiality and intellectual property.",
                confirm: "Understood",
                close: "Close modal",
            },

            mobileOrdersList: {
                infoModal: {
                    title: "Mobile orders list",
                    subtitle: "Quick navigation view",
                    description1:
                        "This screen is designed as a mobile list demo focused on quick consultation, with special attention to readability, spacing and visual hierarchy.",
                    description2:
                        "The goal is to show how I design touch-oriented interfaces for operational flows, making it easy to read the status, client, location and access the detail of each item.",
                    description3:
                        "The data is adapted for portfolio purposes, but the list structure, filtering behavior and experience approach are conceived as a real product screen.",
                    confirm: "Understood",
                    openAriaLabel: "Open page information",
                },
                title: "Orders",
                subtitle: "Mobile list demo",
                clear: "Clear",
                filters: "Filters",
                close: "Close",
                client: "Client",
                selectClient: "Select client",
                activeClientFilter: "Active client filter",
                filterSheetTitle: "Order filters",
                hideCompleted: "Hide completed",
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

                // infoModal
                infoModal: {
                    title: "Operations overview",
                    subtitle: "General panel overview",
                    description1:
                        "This demo represents an operational monitoring dashboard designed to display key indicators, rankings and activity charts in a clear and structured interface.",
                    description2:
                        "The goal of this screen is to show how I present metrics, filters and data visualizations in a product environment while keeping a clean visual hierarchy and reusable components.",
                    description3:
                        "The data and part of the logic are mocked or adapted for portfolio purposes, but the design approach, information structure and user experience are conceived as a real interface.",
                    confirm: "Understood",
                    openAriaLabel: "Open page information",
                },

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
                infoModal: {
                    title: "Performance analytics",
                    subtitle: "Visual tracking of metrics",
                    description1:
                        "This demo shows an analytics screen designed to review the performance evolution of a resource over time through filters, charts and summarized metrics.",
                    description2:
                        "The goal is to show how I structure analytical reading interfaces, combining resource selection, date range, time trend and comparable visualizations in a single view.",
                    description3:
                        "The data is adapted for portfolio purposes, but the hierarchy, experience approach and dashboard composition are conceived as a real product screen.",
                    confirm: "Understood",
                    openAriaLabel: "Open page information",
                },
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
                infoModal: {
                    title: "Production monitoring",
                    subtitle: "Real-time operational monitoring",
                    description1:
                        "This demo represents an operational monitoring screen focused on showing the current service status, the day's activity and the evolution of cases in a single view.",
                    description2:
                        "The goal is to show how I organize supervision interfaces with timelines, key indicators, status cards and lists connected to a clear and easy-to-read time context.",
                    description3:
                        "The data and part of the logic have been adapted for portfolio purposes, but the visual hierarchy, monitoring approach and overall composition are conceived as a real product interface.",
                    confirm: "Understood",
                    openAriaLabel: "Open page information",
                },
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
