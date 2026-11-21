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
            skipToContent: "Saltar al contenido",
            nav: {
                label: "Navegación principal",
                work: "Proyectos",
                experience: "Experiencia",
                stack: "Tecnologías",
                websites: "Portfolios web",
                contact: "Contacto",
                menu: "Menú",
                closeMenu: "Cerrar menú",
                home: "Ir al inicio",
            },
            cv: {
                label: "Descargar CV",
                short: "CV",
                note: "PDF, en inglés",
                ariaLabel: "Descargar CV en PDF (en inglés)",
            },
            language: {
                ariaLabel: "Cambiar idioma a inglés",
            },
            hero: {
                name: "Jose Ángel Quinto Ferrández",
                role: "React, TypeScript, .NET y PostgreSQL",
                title: "Desarrollador full-stack, de la interfaz a la base de datos.",
                summary:
                    "Construyo aplicaciones web completas: interfaces en React y TypeScript, APIs REST en ASP.NET Core y Node.js, y bases de datos PostgreSQL y SQL Server. Ahora trabajo en software de almacén, fabricación y servicio técnico integrado con el ERP.",
                primaryCta: "Ver proyectos",
                contactCta: "Contactar",
                facts: [
                    {
                        label: "Ahora",
                        value: "Full-stack developer en Grupo Innova, desde abril de 2025",
                    },
                    {
                        label: "Ubicación",
                        value: "Valencia, España. Abierto a remoto",
                    },
                    {
                        label: "Idiomas",
                        value: "Español y valenciano nativos, inglés B2",
                    },
                ],
            },
            systemMap: {
                title: "Mi trabajo actual",
                hint: "Módulos en los que desarrollo en Grupo Innova y capas que toco en cada uno",
                modules: [
                    {
                        name: "SGA / WMS",
                        detail: "Recepciones, expediciones, movimientos de stock y lotes",
                    },
                    {
                        name: "MES",
                        detail: "Órdenes de producción, paradas, consumos y calidad",
                    },
                    {
                        name: "SAT",
                        detail: "Partes de servicio conectados al ERP",
                    },
                ],
                layers: [
                    { name: "Interfaz", tech: "React, TypeScript, Tailwind" },
                    { name: "API", tech: "ASP.NET Core, EF Core, Dapper" },
                    { name: "Datos", tech: "PostgreSQL, SQL Server" },
                    { name: "Integración", tech: "ERP, RabbitMQ, n8n" },
                ],
            },
            work: {
                title: "Proyectos",
                intro:
                    "Dos aplicaciones de almacén completas que he desarrollado por mi cuenta, demos de interfaz inspiradas en mi trabajo y pequeñas apps publicadas.",
            },
            featuredLabel: "Proyecto personal",
            techLabel: "Tecnologías",
            pointsLabel: "Puntos clave",
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
            featuredProjectDimension: {
                title: "ArcadiaDimension",
                kicker: "Diseñador visual de almacenes",
                statusLabel: "En producción",
                description:
                    "Editor gráfico para diseñar la distribución física de un almacén sobre un plano a escala real, al estilo de una herramienta CAD ligera o de Figma pero centrado en la logística: zonas, racks con ubicaciones, muelles, puertas y obstáculos. La ocupación y el contenido de cada hueco se representan directamente sobre el plano. Frontend en React con react-konva y Zustand, API Fastify como función serverless en Vercel y PostgreSQL en Neon.",
                highlights: [
                    {
                        title: "Canvas interactivo con precisión métrica",
                        description:
                            "Drag & drop desde la paleta, redimensionado y rotación con imanes cada 45°, snap a cuadrícula, zoom centrado en el cursor y pan. Todas las medidas se expresan en metros reales.",
                    },
                    {
                        title: "Deshacer, rehacer y guardado automático",
                        description:
                            "Historial con etiquetas descriptivas y autoguardado con debounce del plano completo. El servidor calcula el diff mínimo y lo aplica en una única transacción.",
                    },
                    {
                        title: "Ubicaciones y mapa de ocupación",
                        description:
                            "Cada rack genera sus ubicaciones por niveles y huecos (A-01-01…) con artículo, cantidad y lote. Los huecos se colorean según su ocupación y un buscador localiza cualquier artículo en el plano.",
                    },
                    {
                        title: "Concurrencia optimista sin pérdida de stock",
                        description:
                            "Si el plano cambia en otra pestaña o sesión, el editor avisa en lugar de sobrescribir. Eliminar un rack con stock y deshacer lo restaura con todo su contenido.",
                    },
                ],
                tags: [
                    "React",
                    "TypeScript",
                    "Konva",
                    "Zustand",
                    "TanStack Query",
                    "Fastify",
                    "PostgreSQL",
                    "Neon",
                    "Drizzle ORM",
                    "Zod",
                    "Vitest",
                ],
                demoHref: "https://arcadiadimension.vercel.app",
                demoCta: "Abrir aplicación",
                codeHref: "https://github.com/JoseAQuinto/ArcadiaDimension",
                codeCta: "Ver código",
                credentialsLabel: "Acceso de demostración",
                credentialsValue: "demo@arcadiadimension.app / demo1234",
            },
            demos: {
                title: "Demos de interfaz",
                intro:
                    "Una selección de demos donde muestro estructura, componentes reutilizables e interfaces conectadas a datos mock o APIs.",
            },
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
                    title: "Enterprise Operations Suite",
                    description:
                        "Suite de paneles de operaciones inspirada en interfaces de ERP, SGA y MES en las que he trabajado: incidencias e inactividad por recurso, analítica de rendimiento (disponibilidad, calidad y eficiencia), gestión de pedidos en móvil y monitorización de un centro de soporte con SLA. Datos mock y componentes reutilizables.",
                    href: "/portfolio-demo",
                    cta: "Ver demo",
                    tags: ["React", "TypeScript", "Tailwind", "Highcharts", "Mock API"],
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
            apps: {
                title: "Apps publicadas",
                intro: "Pequeñas aplicaciones que he publicado por mi cuenta.",
                onlineLabel: "En línea",
                openCta: "Abrir aplicación",
                codeCta: "Ver código",
            },
            operationalProjects: [
                {
                    id: "es-estafa",
                    title: "¿Es Estafa?",
                    description:
                        "Aplicación web pública que analiza señales habituales de phishing y estafa en correos, SMS, WhatsApp y otros mensajes sospechosos, ofreciendo un resultado de riesgo explicable y recomendaciones prácticas.",
                    href: "https://esestafaa.netlify.app/",
                    tags: ["Next.js", "TypeScript", "Supabase", "Seguridad"],
                },
                {
                    id: "did-u-sleep-well",
                    title: "DidUSleepWell",
                    description:
                        "App de seguimiento del sueño minimalista y 100% offline. Cada mañana registras en unos segundos cómo has dormido y la app muestra tendencias, estadísticas y patrones calculados en el propio dispositivo. Sin backend, cuentas ni analítica: los datos nunca salen del móvil, con exportación e importación en JSON, recordatorio diario, modo oscuro y versión en español e inglés.",
                    href: "https://didusleepwell.netlify.app/",
                    codeHref: "https://github.com/JoseAQuinto/DidUSleepWell",
                    tags: ["React Native", "Expo", "TypeScript", "AsyncStorage", "i18next", "Offline-first"],
                },
            ],
            about: {
                title: "Experiencia",
                intro:
                    "Trabajo en Grupo Innova desde enero de 2025: primero en prácticas y, desde abril, como desarrollador full-stack. Mi día a día es software para almacén, fábrica y servicio técnico: pantallas de operario, APIs REST, SQL y la integración con el ERP.",
                roles: [
                    {
                        period: "Abr 2025 – actualidad",
                        title: "Full-stack developer",
                        org: "Grupo Innova",
                        areas: [
                            {
                                name: "SGA / WMS (gestión de almacén)",
                                text: "Funcionalidades de recepciones, expediciones, movimientos de stock, regularizaciones y devoluciones, con trazabilidad por lote y pantallas de operario. Operaciones de stock transaccionales en C# y PostgreSQL.",
                            },
                            {
                                name: "MES (ejecución de fabricación)",
                                text: "Desarrollo y mantenimiento de interfaces en React y APIs en .NET para órdenes y partes de producción, máquinas, paradas, consumos, calidad y flujos relacionados con costes.",
                            },
                            {
                                name: "SAT (servicio técnico)",
                                text: "Flujos de servicio conectados al ERP, incluida la obtención de la configuración del SAT y la creación de partes de servicio con su estado inicial.",
                            },
                            {
                                name: "Integración con ERP",
                                text: "Endpoints REST y flujos de sincronización de artículos, clientes, proveedores, pedidos, documentos y stock, con eventos en RabbitMQ y flujos en n8n.",
                            },
                            {
                                name: "Datos y despliegue",
                                text: "SQL, esquemas y migraciones con EF Core y Dapper sobre PostgreSQL y SQL Server. Despliegue de servicios con IIS, Docker y CI/CD.",
                            },
                        ],
                    },
                    {
                        period: "Ene – mar 2025",
                        title: "Prácticas de desarrollo de software",
                        org: "Grupo Innova",
                        areas: [],
                    },
                ],
                educationTitle: "Formación",
                // En orden cronológico: la línea temporal va del pasado al presente.
                education: [
                    {
                        title: "CFGS Administración y Finanzas",
                        place: "IES El Grao, Valencia",
                        period: "2021 – 2023",
                    },
                    {
                        title: "CFGS Desarrollo de Aplicaciones Web (DAW)",
                        place: "IES Abastos, Valencia",
                        period: "2023 – 2025",
                    },
                ],
                timeline: {
                    label: "Formación y experiencia, de 2021 a hoy",
                    hint: "Sigue bajando: la línea avanza de 2021 a hoy.",
                    scrollHint: "Desliza en horizontal para recorrer la línea.",
                    today: "Hoy",
                    kinds: {
                        education: "Formación",
                        internship: "Prácticas",
                        work: "Trabajo actual",
                        area: "Grupo Innova",
                    },
                },
                languagesTitle: "Idiomas",
                languages: [
                    { title: "Español", detail: "Nativo" },
                    { title: "Valenciano / catalán", detail: "Nativo" },
                    { title: "Inglés", detail: "B2" },
                    { title: "Alemán", detail: "A1" },
                ],
            },
            stack: {
                title: "Tecnologías",
                intro:
                    "Lo que uso en el día a día y para qué. En oscuro, lo que más trabajo.",
                groups: [
                    {
                        name: "Frontend",
                        core: ["React", "TypeScript"],
                        extra: ["JavaScript", "HTML y CSS", "Tailwind CSS", "Zustand"],
                        use: "Pantallas de operario, tablas dinámicas, formularios y modales conectados a APIs REST propias.",
                    },
                    {
                        name: "Backend",
                        core: ["C#", "ASP.NET Core (.NET 7/8)"],
                        extra: ["APIs REST", "EF Core", "Dapper", "JWT", "SignalR", "Node.js"],
                        use: "Endpoints REST, validaciones de negocio y operaciones de stock dentro de transacciones.",
                    },
                    {
                        name: "Datos",
                        core: ["PostgreSQL", "SQL Server"],
                        extra: ["SQL", "TimescaleDB", "Triggers", "Row-Level Security"],
                        use: "Diseño relacional, migraciones, transacciones y consultas para operaciones y listados.",
                    },
                    {
                        name: "Integración y entrega",
                        core: ["RabbitMQ", "Docker"],
                        extra: ["n8n", "APIs de ERP", "IIS", "Git", "Gitea Actions", "Stimulsoft"],
                        use: "Sincronización con el ERP mediante eventos, informes y despliegues en IIS y Docker con CI/CD.",
                    },
                ],
            },
            websites: {
                title: "Portfolios web",
                text:
                    "Además de software de gestión, diseño y desarrollo portfolios y webs de presentación donde la identidad visual se adapta a cada perfil y sector.",
                cta: "Ver la galería",
                countSuffix: "webs publicadas",
            },
            contact: {
                title: "Contacto",
                text:
                    "Si buscas a alguien para desarrollar o mantener software de almacén, fabricación o integración con ERP, escríbeme.",
                copy: "Copiar email",
                copied: "Email copiado al portapapeles",
                copyFailed: "No se ha podido copiar. Selecciona el email y cópialo a mano.",
                channelsLabel: "Otros canales",
                linkedin: "LinkedIn",
                linkedinDetail: "Perfil profesional",
                github: "GitHub",
                githubDetail: "Código de mis proyectos",
                cv: "CV",
                cvDetail: "PDF, en inglés",
                location: "Ubicación",
                locationDetail: "Valencia, España. Abierto a remoto",
            },
            footer: {
                rights: "Jose Ángel Quinto Ferrández",
                built: "Diseñado y desarrollado por mí con React y TypeScript.",
                source: "Código de esta web",
                backToTop: "Volver arriba",
            },
        },

        portfolioDemo: {
            title: "Enterprise Operations Suite",
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
            skipToContent: "Skip to content",
            nav: {
                label: "Main navigation",
                work: "Projects",
                experience: "Experience",
                stack: "Tech stack",
                websites: "Web portfolios",
                contact: "Contact",
                menu: "Menu",
                closeMenu: "Close menu",
                home: "Go to top",
            },
            cv: {
                label: "Download CV",
                short: "CV",
                note: "PDF",
                ariaLabel: "Download CV as PDF",
            },
            language: {
                ariaLabel: "Change language to Spanish",
            },
            hero: {
                name: "Jose Ángel Quinto Ferrández",
                role: "React, TypeScript, .NET and PostgreSQL",
                title: "Full-stack developer, from interface to database.",
                summary:
                    "I build complete web applications: React and TypeScript interfaces, ASP.NET Core and Node.js REST APIs, and PostgreSQL and SQL Server databases. I currently work on warehouse, manufacturing and technical service software integrated with the ERP.",
                primaryCta: "View projects",
                contactCta: "Get in touch",
                facts: [
                    {
                        label: "Now",
                        value: "Full-stack developer at Grupo Innova since April 2025",
                    },
                    {
                        label: "Location",
                        value: "Valencia, Spain. Open to remote",
                    },
                    {
                        label: "Languages",
                        value: "Native Spanish and Valencian, English B2",
                    },
                ],
            },
            systemMap: {
                title: "My current work",
                hint: "Modules I develop at Grupo Innova and the layers I work on in each",
                modules: [
                    {
                        name: "SGA / WMS",
                        detail: "Receipts, dispatch, stock movements and lots",
                    },
                    {
                        name: "MES",
                        detail: "Production orders, downtime, consumption and quality",
                    },
                    {
                        name: "SAT",
                        detail: "Service reports connected to the ERP",
                    },
                ],
                layers: [
                    { name: "Interface", tech: "React, TypeScript, Tailwind" },
                    { name: "API", tech: "ASP.NET Core, EF Core, Dapper" },
                    { name: "Data", tech: "PostgreSQL, SQL Server" },
                    { name: "Integration", tech: "ERP, RabbitMQ, n8n" },
                ],
            },
            work: {
                title: "Projects",
                intro:
                    "Two complete warehouse applications I built on my own, interface demos inspired by my day-to-day work and a few small published apps.",
            },
            featuredLabel: "Personal project",
            techLabel: "Technologies",
            pointsLabel: "Key points",
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
            featuredProjectDimension: {
                title: "ArcadiaDimension",
                kicker: "Visual Warehouse Designer",
                statusLabel: "In production",
                description:
                    "A graphical editor for designing the physical layout of a warehouse on a real-scale floor plan, like a lightweight CAD tool or Figma but focused on logistics: zones, racks with locations, docks, doors and obstacles. Occupancy and the contents of every slot are shown directly on the plan. React frontend with react-konva and Zustand, Fastify API as a serverless function on Vercel and PostgreSQL on Neon.",
                highlights: [
                    {
                        title: "Interactive canvas with metric precision",
                        description:
                            "Drag & drop from the palette, resizing and rotation with 45° snapping, grid snap, cursor-centred zoom and pan. Every measurement is expressed in real metres.",
                    },
                    {
                        title: "Undo, redo and autosave",
                        description:
                            "History with descriptive labels and debounced autosave of the whole plan. The server computes the minimal diff and applies it in a single transaction.",
                    },
                    {
                        title: "Locations and occupancy map",
                        description:
                            "Each rack generates its locations by level and slot (A-01-01…) with item, quantity and lot. Slots are coloured by occupancy and a search box finds any item on the plan.",
                    },
                    {
                        title: "Optimistic concurrency with no stock loss",
                        description:
                            "If the plan changes in another tab or session, the editor warns instead of overwriting. Deleting a rack with stock and undoing restores it with all of its contents.",
                    },
                ],
                tags: [
                    "React",
                    "TypeScript",
                    "Konva",
                    "Zustand",
                    "TanStack Query",
                    "Fastify",
                    "PostgreSQL",
                    "Neon",
                    "Drizzle ORM",
                    "Zod",
                    "Vitest",
                ],
                demoHref: "https://arcadiadimension.vercel.app",
                demoCta: "Open application",
                codeHref: "https://github.com/JoseAQuinto/ArcadiaDimension",
                codeCta: "View code",
                credentialsLabel: "Demo access",
                credentialsValue: "demo@arcadiadimension.app / demo1234",
            },
            demos: {
                title: "Interface demos",
                intro:
                    "A selection of demos where I showcase structure, reusable components and interfaces connected to mock data or APIs.",
            },
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
                    title: "Enterprise Operations Suite",
                    description:
                        "A suite of operations dashboards inspired by ERP, WMS and MES interfaces I have worked on: downtime and incidents by resource, performance analytics (availability, quality and efficiency), mobile order management and support centre monitoring with SLAs. Mock data and reusable components.",
                    href: "/portfolio-demo",
                    cta: "View demo",
                    tags: ["React", "TypeScript", "Tailwind", "Highcharts", "Mock API"],
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
            apps: {
                title: "Published apps",
                intro: "Small applications I have published on my own.",
                onlineLabel: "Online",
                openCta: "Open application",
                codeCta: "View code",
            },
            operationalProjects: [
                {
                    id: "es-estafa",
                    title: "Is It a Scam?",
                    description:
                        "A public web application that analyzes common phishing and scam signals in emails, SMS, WhatsApp and other suspicious messages, providing an explainable risk result and practical recommendations.",
                    href: "https://esestafaa.netlify.app/",
                    tags: ["Next.js", "TypeScript", "Supabase", "Security"],
                },
                {
                    id: "did-u-sleep-well",
                    title: "DidUSleepWell",
                    description:
                        "A minimal, fully offline sleep-tracking app. Every morning you log how you slept in a few seconds, and the app surfaces trends, statistics and patterns computed on the device itself. No backend, accounts or analytics: your data never leaves your phone, with JSON export and import, a daily reminder, dark mode and English and Spanish versions.",
                    href: "https://didusleepwell.netlify.app/",
                    codeHref: "https://github.com/JoseAQuinto/DidUSleepWell",
                    tags: ["React Native", "Expo", "TypeScript", "AsyncStorage", "i18next", "Offline-first"],
                },
            ],
            about: {
                title: "Experience",
                intro:
                    "I have worked at Grupo Innova since January 2025: first as an intern and, since April, as a full-stack developer. My day-to-day is software for warehouses, factories and technical service: operator screens, REST APIs, SQL and ERP integration.",
                roles: [
                    {
                        period: "Apr 2025 – present",
                        title: "Full-stack developer",
                        org: "Grupo Innova",
                        areas: [
                            {
                                name: "SGA / WMS (warehouse management)",
                                text: "Features for receipts, dispatch, stock movements, adjustments and returns, with lot traceability and operator screens. Transactional stock operations in C# and PostgreSQL.",
                            },
                            {
                                name: "MES (manufacturing execution)",
                                text: "Developed and maintained React interfaces and .NET APIs for production orders and reports, machines, downtime, consumption, quality and cost-related workflows.",
                            },
                            {
                                name: "SAT (technical service)",
                                text: "ERP-connected service workflows, including SAT configuration retrieval and creation of service reports with their initial status.",
                            },
                            {
                                name: "ERP integration",
                                text: "REST endpoints and synchronisation flows for articles, customers, suppliers, orders, documents and stock, with RabbitMQ events and n8n workflows.",
                            },
                            {
                                name: "Data and delivery",
                                text: "SQL, schemas and migrations using EF Core and Dapper across PostgreSQL and SQL Server. Services deployed with IIS, Docker and CI/CD.",
                            },
                        ],
                    },
                    {
                        period: "Jan – Mar 2025",
                        title: "Software development intern",
                        org: "Grupo Innova",
                        areas: [],
                    },
                ],
                educationTitle: "Education",
                // Chronological order: the timeline runs from past to present.
                education: [
                    {
                        title: "Higher Vocational Diploma in Administration and Finance",
                        place: "IES El Grao, Valencia",
                        period: "2021 – 2023",
                    },
                    {
                        title: "Higher Vocational Diploma in Web Application Development (DAW)",
                        place: "IES Abastos, Valencia",
                        period: "2023 – 2025",
                    },
                ],
                timeline: {
                    label: "Education and experience, from 2021 to today",
                    hint: "Keep scrolling: the line moves from 2021 to today.",
                    scrollHint: "Swipe sideways to follow the line.",
                    today: "Today",
                    kinds: {
                        education: "Education",
                        internship: "Internship",
                        work: "Current role",
                        area: "Grupo Innova",
                    },
                },
                languagesTitle: "Languages",
                languages: [
                    { title: "Spanish", detail: "Native" },
                    { title: "Valencian / Catalan", detail: "Native" },
                    { title: "English", detail: "B2" },
                    { title: "German", detail: "A1" },
                ],
            },
            stack: {
                title: "Tech stack",
                intro:
                    "What I use day to day and what for. Dark tags mark what I work with most.",
                groups: [
                    {
                        name: "Frontend",
                        core: ["React", "TypeScript"],
                        extra: ["JavaScript", "HTML & CSS", "Tailwind CSS", "Zustand"],
                        use: "Operator screens, dynamic tables, forms and modals connected to in-house REST APIs.",
                    },
                    {
                        name: "Backend",
                        core: ["C#", "ASP.NET Core (.NET 7/8)"],
                        extra: ["REST APIs", "EF Core", "Dapper", "JWT", "SignalR", "Node.js"],
                        use: "REST endpoints, business validation and stock operations inside transactions.",
                    },
                    {
                        name: "Data",
                        core: ["PostgreSQL", "SQL Server"],
                        extra: ["SQL", "TimescaleDB", "Triggers", "Row-Level Security"],
                        use: "Relational design, migrations, transactions and queries for operations and listings.",
                    },
                    {
                        name: "Integration & delivery",
                        core: ["RabbitMQ", "Docker"],
                        extra: ["n8n", "ERP APIs", "IIS", "Git", "Gitea Actions", "Stimulsoft"],
                        use: "Event-based ERP synchronisation, reports and deployments on IIS and Docker with CI/CD.",
                    },
                ],
            },
            websites: {
                title: "Web portfolios",
                text:
                    "Alongside business software, I design and build portfolios and presentation websites whose visual identity is adapted to each profile and field.",
                cta: "View the gallery",
                countSuffix: "published websites",
            },
            contact: {
                title: "Contact",
                text:
                    "If you need someone to build or maintain warehouse, manufacturing or ERP integration software, send me an email.",
                copy: "Copy email",
                copied: "Email copied to clipboard",
                copyFailed: "Could not copy. Select the email and copy it manually.",
                channelsLabel: "Other channels",
                linkedin: "LinkedIn",
                linkedinDetail: "Professional profile",
                github: "GitHub",
                githubDetail: "Code for my projects",
                cv: "CV",
                cvDetail: "PDF",
                location: "Location",
                locationDetail: "Valencia, Spain. Open to remote",
            },
            footer: {
                rights: "Jose Ángel Quinto Ferrández",
                built: "Designed and built by me with React and TypeScript.",
                source: "Source code of this site",
                backToTop: "Back to top",
            },
        },

        portfolioDemo: {
            title: "Enterprise Operations Suite",
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
