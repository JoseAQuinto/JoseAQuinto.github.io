(function () {
  "use strict";

  const categories = [
    { id: "development", label: "Desarrollo" },
    { id: "design", label: "Diseño" },
    { id: "meeting", label: "Reunión" },
    { id: "personal", label: "Personal" },
    { id: "marketing", label: "Marketing" },
  ];

  const priorities = [
    { id: "low", label: "Baja" },
    { id: "medium", label: "Media" },
    { id: "high", label: "Alta" },
    { id: "urgent", label: "Urgente" },
  ];

  const statuses = [
    { id: "todo", label: "Pendiente" },
    { id: "in-progress", label: "En progreso" },
    { id: "done", label: "Completada" },
  ];

  function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function dateForDay(year, month, day) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return toDateKey(new Date(year, month, Math.min(day, lastDay)));
  }

  function createDemoTasks(referenceDate = new Date()) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const stamp = `${year}-${String(month + 1).padStart(2, "0")}`;
    const task = (
      index,
      title,
      description,
      day,
      category,
      priority,
      status
    ) => ({
      id: `demo-${stamp}-${index}`,
      title,
      description,
      date: day ? dateForDay(year, month, day) : null,
      category,
      priority,
      status,
      order: index,
      createdAt: new Date(year, month, 1, 9, index).toISOString(),
    });

    return [
      task(1, "Reunión de arranque", "Alinear alcance, entregables y próximos hitos con el cliente.", 2, "meeting", "high", "done"),
      task(2, "Diseñar dashboard de analytics", "Definir jerarquía, componentes y estados vacíos de la vista principal.", 4, "design", "high", "in-progress"),
      task(3, "Revisar pull request", "Validar accesibilidad, tests y consistencia del nuevo flujo.", 6, "development", "medium", "todo"),
      task(4, "Implementar autenticación", "Completar estados de sesión y recuperación de contraseña.", 9, "development", "urgent", "in-progress"),
      task(5, "Preparar presentación", "Sintetizar decisiones de producto y métricas del sprint.", 11, "marketing", "medium", "done"),
      task(6, "Optimizar rendimiento", "Reducir el peso inicial y revisar tareas largas del hilo principal.", 14, "development", "high", "todo"),
      task(7, "Plan editorial", "Organizar las piezas del próximo lanzamiento por canal.", 16, "marketing", "low", "todo"),
      task(8, "Deploy a producción", "Publicar la versión, revisar monitorización y documentar el cambio.", 19, "development", "urgent", "todo"),
      task(9, "Corregir bug de navegación", "Resolver el salto de foco al cerrar el panel lateral.", 21, "development", "high", "todo"),
      task(10, "Retrospectiva de sprint", "Recoger aprendizajes y convertirlos en acciones concretas.", 24, "meeting", "medium", "todo"),
      task(11, "Revisar métricas mensuales", "Comparar progreso, bloqueos y capacidad del equipo.", 26, "meeting", "low", "todo"),
      task(12, "Pruebas responsive", "Validar calendario, formularios y navegación en móvil.", 28, "design", "high", "todo"),
      task(13, "Documentar componentes", "Añadir ejemplos de uso y criterios de accesibilidad.", null, "development", "medium", "todo"),
      task(14, "Explorar nueva identidad visual", "Preparar un moodboard breve para el siguiente proyecto.", null, "design", "low", "todo"),
      task(15, "Reservar sesión de foco", "Bloquear una mañana sin reuniones para trabajo profundo.", null, "personal", "medium", "todo"),
    ];
  }

  window.VisualPlannerData = Object.freeze({
    categories,
    priorities,
    statuses,
    createDemoTasks,
    toDateKey,
  });
})();
