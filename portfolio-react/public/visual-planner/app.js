(function () {
  "use strict";

  const data = window.VisualPlannerData;
  const storage = window.VisualPlannerStorage;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let state = storage.loadState();
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let searchQuery = "";
  let draggedTaskId = null;
  let pendingConfirmation = null;
  let ignoreCardClick = false;

  const elements = {
    currentMonth: document.querySelector("#current-month"),
    monthSummary: document.querySelector("#month-summary"),
    previousMonth: document.querySelector("#previous-month"),
    nextMonth: document.querySelector("#next-month"),
    todayButton: document.querySelector("#today-button"),
    newTaskButton: document.querySelector("#new-task-button"),
    backlogAdd: document.querySelector("#backlog-add"),
    calendarGrid: document.querySelector("#calendar-grid"),
    backlogList: document.querySelector("#backlog-list"),
    backlogCount: document.querySelector("#backlog-count"),
    categoryFilter: document.querySelector("#category-filter"),
    statusFilters: document.querySelector("#status-filters"),
    taskSearch: document.querySelector("#task-search"),
    resetDemo: document.querySelector("#reset-demo"),
    themeToggle: document.querySelector("#theme-toggle"),
    metricTotal: document.querySelector("#metric-total"),
    metricCompleted: document.querySelector("#metric-completed"),
    metricCompletedCaption: document.querySelector("#metric-completed-caption"),
    metricProgress: document.querySelector("#metric-progress"),
    metricOverdue: document.querySelector("#metric-overdue"),
    metricPercentage: document.querySelector("#metric-percentage"),
    progressBar: document.querySelector("#progress-bar"),
    taskDrawer: document.querySelector("#task-drawer"),
    drawerTitle: document.querySelector("#drawer-title"),
    closeDrawer: document.querySelector("#close-drawer"),
    cancelTask: document.querySelector("#cancel-task"),
    taskForm: document.querySelector("#task-form"),
    taskId: document.querySelector("#task-id"),
    taskTitle: document.querySelector("#task-title"),
    taskDescription: document.querySelector("#task-description"),
    taskDate: document.querySelector("#task-date"),
    taskCategory: document.querySelector("#task-category"),
    priorityOptions: document.querySelector("#priority-options"),
    statusOptions: document.querySelector("#status-options"),
    titleError: document.querySelector("#title-error"),
    deleteTask: document.querySelector("#delete-task"),
    taskMeta: document.querySelector("#task-meta"),
    taskCreatedAt: document.querySelector("#task-created-at"),
    confirmDialog: document.querySelector("#confirm-dialog"),
    confirmTitle: document.querySelector("#confirm-title"),
    confirmMessage: document.querySelector("#confirm-message"),
    confirmCancel: document.querySelector("#confirm-cancel"),
    confirmAction: document.querySelector("#confirm-action"),
    toastRegion: document.querySelector("#toast-region"),
  };

  const monthFormatter = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  });

  const fullDateFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const createdAtFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function initialize() {
    populateControls();
    bindEvents();
    applyTheme();
    syncFilterControls();
    render();
  }

  function populateControls() {
    data.categories.forEach((category) => {
      elements.categoryFilter.append(
        createOption(category.id, category.label)
      );
      elements.taskCategory.append(createOption(category.id, category.label));
    });

    data.priorities.forEach((priority) => {
      elements.priorityOptions.append(
        createChoiceOption("priority", priority, "medium")
      );
    });

    data.statuses.forEach((status) => {
      elements.statusOptions.append(
        createChoiceOption("status", status, "todo")
      );
    });
  }

  function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function createChoiceOption(name, item, defaultValue) {
    const label = document.createElement("label");
    label.className = "choice-option";
    label.dataset.value = item.id;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = item.id;
    input.checked = item.id === defaultValue;

    const span = document.createElement("span");
    span.textContent = item.label;
    label.append(input, span);
    return label;
  }

  function bindEvents() {
    elements.previousMonth.addEventListener("click", () => changeMonth(-1));
    elements.nextMonth.addEventListener("click", () => changeMonth(1));
    elements.todayButton.addEventListener("click", goToToday);
    elements.newTaskButton.addEventListener("click", () => openTaskDrawer());
    elements.backlogAdd.addEventListener("click", () => openTaskDrawer());
    elements.themeToggle.addEventListener("click", toggleTheme);
    elements.resetDemo.addEventListener("click", requestDemoReset);

    elements.statusFilters.addEventListener("click", handleStatusFilter);
    elements.categoryFilter.addEventListener("change", handleCategoryFilter);
    elements.taskSearch.addEventListener("input", handleSearch);

    elements.calendarGrid.addEventListener("click", handleCalendarClick);
    elements.calendarGrid.addEventListener("keydown", handleTaskKeydown);
    elements.backlogList.addEventListener("click", handleTaskClick);
    elements.backlogList.addEventListener("keydown", handleTaskKeydown);

    elements.calendarGrid.addEventListener("dragstart", handleDragStart);
    elements.calendarGrid.addEventListener("dragend", handleDragEnd);
    elements.calendarGrid.addEventListener("dragover", handleCalendarDragOver);
    elements.calendarGrid.addEventListener("drop", handleCalendarDrop);
    elements.backlogList.addEventListener("dragstart", handleDragStart);
    elements.backlogList.addEventListener("dragend", handleDragEnd);
    elements.backlogList.addEventListener("dragover", handleBacklogDragOver);
    elements.backlogList.addEventListener("drop", handleBacklogDrop);

    elements.closeDrawer.addEventListener("click", closeTaskDrawer);
    elements.cancelTask.addEventListener("click", closeTaskDrawer);
    elements.taskForm.addEventListener("submit", saveTaskFromForm);
    elements.taskTitle.addEventListener("input", clearTitleError);
    elements.deleteTask.addEventListener("click", requestTaskDelete);

    elements.confirmCancel.addEventListener("click", closeConfirmDialog);
    elements.confirmAction.addEventListener("click", runConfirmation);

    elements.taskDrawer.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeTaskDrawer();
    });
    elements.confirmDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeConfirmDialog();
    });
    elements.taskDrawer.addEventListener("click", handleDialogBackdropClick);
    elements.confirmDialog.addEventListener("click", handleDialogBackdropClick);

    document.addEventListener("keydown", handleGlobalShortcuts);
  }

  function render() {
    renderHeading();
    renderMetrics();
    renderBacklog();
    renderCalendar();
  }

  function renderHeading() {
    elements.currentMonth.textContent = monthFormatter.format(viewDate);
    const monthPrefix = `${viewDate.getFullYear()}-${String(
      viewDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const planned = state.tasks.filter((task) => task.date?.startsWith(monthPrefix)).length;
    const backlog = state.tasks.filter((task) => !task.date).length;
    elements.monthSummary.textContent = `${planned} ${pluralize(
      planned,
      "tarea planificada",
      "tareas planificadas"
    )} · ${backlog} en backlog`;
    document.title = `${capitalize(monthFormatter.format(viewDate))} · Visual Planner`;
  }

  function renderMetrics() {
    const total = state.tasks.length;
    const completed = state.tasks.filter((task) => task.status === "done").length;
    const inProgress = state.tasks.filter(
      (task) => task.status === "in-progress"
    ).length;
    const overdue = state.tasks.filter(isOverdue).length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    const monthPrefix = `${viewDate.getFullYear()}-${String(
      viewDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const completedThisMonth = state.tasks.filter(
      (task) => task.status === "done" && task.date?.startsWith(monthPrefix)
    ).length;

    elements.metricTotal.textContent = total;
    elements.metricCompleted.textContent = completed;
    elements.metricCompletedCaption.textContent = `${completedThisMonth} este mes`;
    elements.metricProgress.textContent = inProgress;
    elements.metricOverdue.textContent = overdue;
    elements.metricPercentage.textContent = `${percentage}%`;
    elements.progressBar.style.width = `${percentage}%`;
  }

  function renderBacklog() {
    const allBacklogTasks = state.tasks
      .filter((task) => !task.date)
      .sort(sortTasks);
    const visibleTasks = allBacklogTasks.filter(matchesFilters);

    elements.backlogCount.textContent = allBacklogTasks.length;
    elements.backlogList.replaceChildren();

    visibleTasks.forEach((task) => {
      elements.backlogList.append(createTaskCard(task));
    });

    if (!visibleTasks.length) {
      elements.backlogList.append(
        createEmptyState(
          allBacklogTasks.length
            ? "No hay tareas que coincidan con los filtros."
            : "El backlog está vacío. Arrastra aquí una tarea para quitarle la fecha."
        )
      );
    }
  }

  function renderCalendar() {
    elements.calendarGrid.replaceChildren();
    const firstOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1
    );
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1 - mondayOffset
    );

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      elements.calendarGrid.append(createCalendarDay(date));
    }
  }

  function createCalendarDay(date) {
    const dateKey = data.toDateKey(date);
    const isOutside = date.getMonth() !== viewDate.getMonth();
    const isToday = dateKey === data.toDateKey(today);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const allTasks = state.tasks
      .filter((task) => task.date === dateKey)
      .sort(sortTasks);
    const visibleTasks = allTasks.filter(matchesFilters);

    const day = document.createElement("section");
    day.className = "calendar-day";
    day.dataset.date = dateKey;
    day.setAttribute("aria-label", capitalize(fullDateFormatter.format(date)));
    if (isOutside) day.classList.add("is-outside");
    if (isToday) day.classList.add("is-today");
    if (isWeekend) day.classList.add("is-weekend");

    const header = document.createElement("header");
    header.className = "day-header";
    header.dataset.weekday = new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
    }).format(date);

    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = date.getDate();

    const headerTools = document.createElement("span");
    headerTools.className = "day-header-tools";

    if (allTasks.length) {
      const count = document.createElement("span");
      count.className = "day-count";
      count.textContent = `${allTasks.length}`;
      count.title = pluralize(allTasks.length, "1 tarea", `${allTasks.length} tareas`);
      headerTools.append(count);
    }

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "day-add";
    addButton.dataset.action = "add-task";
    addButton.dataset.date = dateKey;
    addButton.setAttribute(
      "aria-label",
      `Crear tarea el ${fullDateFormatter.format(date)}`
    );
    addButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>';
    headerTools.append(addButton);
    header.append(dayNumber, headerTools);

    const taskList = document.createElement("div");
    taskList.className = "task-list day-task-list";
    taskList.dataset.dropDate = dateKey;
    visibleTasks.forEach((task) => taskList.append(createTaskCard(task)));

    day.append(header, taskList);
    return day;
  }

  function createTaskCard(task) {
    const category = findById(data.categories, task.category);
    const priority = findById(data.priorities, task.priority);
    const status = findById(data.statuses, task.status);

    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.taskId = task.id;
    card.dataset.category = task.category;
    card.draggable = true;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `${task.title}. ${category.label}. Prioridad ${priority.label}. ${status.label}. Pulsa Enter para editar.`
    );
    if (task.status === "done") card.classList.add("is-completed");
    if (isOverdue(task)) card.classList.add("is-overdue");

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("span");
    meta.className = "task-meta-row";

    const dot = document.createElement("span");
    dot.className = "category-dot";
    dot.setAttribute("aria-hidden", "true");

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "category-label";
    categoryLabel.textContent = category.label;

    const priorityLabel = document.createElement("span");
    priorityLabel.className = "priority-label";
    priorityLabel.dataset.priority = task.priority;
    priorityLabel.textContent = priority.label;

    meta.append(dot, categoryLabel, priorityLabel);
    card.append(title, meta);
    return card;
  }

  function createEmptyState(message) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = message;
    return empty;
  }

  function matchesFilters(task) {
    const statusMatches =
      state.preferences.statusFilter === "all" ||
      task.status === state.preferences.statusFilter;
    const categoryMatches =
      state.preferences.categoryFilter === "all" ||
      task.category === state.preferences.categoryFilter;
    const normalizedQuery = normalizeText(searchQuery);
    const textMatches =
      !normalizedQuery ||
      normalizeText(`${task.title} ${task.description || ""}`).includes(
        normalizedQuery
      );
    return statusMatches && categoryMatches && textMatches;
  }

  function sortTasks(first, second) {
    if (first.status === "done" && second.status !== "done") return 1;
    if (first.status !== "done" && second.status === "done") return -1;
    return (first.order || 0) - (second.order || 0);
  }

  function isOverdue(task) {
    return Boolean(
      task.date &&
        task.status !== "done" &&
        task.date < data.toDateKey(today)
    );
  }

  function changeMonth(direction) {
    viewDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + direction,
      1
    );
    render();
    announceMonth();
  }

  function goToToday() {
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    render();
    const todayCell = document.querySelector(".calendar-day.is-today");
    todayCell?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
  }

  function announceMonth() {
    elements.calendarGrid.setAttribute(
      "aria-label",
      `Calendario de ${monthFormatter.format(viewDate)}`
    );
  }

  function handleStatusFilter(event) {
    const button = event.target.closest("[data-status]");
    if (!button) return;
    state.preferences.statusFilter = button.dataset.status;
    persistState();
    syncFilterControls();
    render();
  }

  function handleCategoryFilter(event) {
    state.preferences.categoryFilter = event.target.value;
    persistState();
    render();
  }

  function handleSearch(event) {
    searchQuery = event.target.value.trim();
    render();
  }

  function syncFilterControls() {
    elements.statusFilters.querySelectorAll("[data-status]").forEach((button) => {
      const active = button.dataset.status === state.preferences.statusFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    elements.categoryFilter.value = state.preferences.categoryFilter;
  }

  function handleCalendarClick(event) {
    const addButton = event.target.closest('[data-action="add-task"]');
    if (addButton) {
      openTaskDrawer(null, addButton.dataset.date);
      return;
    }
    handleTaskClick(event);
  }

  function handleTaskClick(event) {
    if (ignoreCardClick) return;
    const card = event.target.closest(".task-card");
    if (!card) return;
    const task = state.tasks.find((item) => item.id === card.dataset.taskId);
    if (task) openTaskDrawer(task);
  }

  function handleTaskKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".task-card");
    if (!card) return;
    event.preventDefault();
    const task = state.tasks.find((item) => item.id === card.dataset.taskId);
    if (task) openTaskDrawer(task);
  }

  function openTaskDrawer(task = null, preferredDate = "") {
    clearTitleError();
    elements.taskForm.reset();
    elements.taskId.value = task?.id || "";
    elements.taskTitle.value = task?.title || "";
    elements.taskDescription.value = task?.description || "";
    elements.taskDate.value = task?.date || preferredDate || "";
    elements.taskCategory.value = task?.category || "development";
    setRadioValue("priority", task?.priority || "medium");
    setRadioValue("status", task?.status || "todo");
    elements.drawerTitle.textContent = task ? "Editar tarea" : "Nueva tarea";
    elements.deleteTask.hidden = !task;
    elements.taskMeta.hidden = !task;

    if (task) {
      const createdAt = new Date(task.createdAt);
      elements.taskCreatedAt.textContent = Number.isNaN(createdAt.getTime())
        ? "—"
        : createdAtFormatter.format(createdAt);
      elements.taskCreatedAt.dateTime = task.createdAt || "";
    }

    if (!elements.taskDrawer.open) elements.taskDrawer.showModal();
    syncDialogState();
    window.setTimeout(() => elements.taskTitle.focus(), 60);
  }

  function closeTaskDrawer() {
    if (elements.taskDrawer.open) elements.taskDrawer.close();
    clearTitleError();
    syncDialogState();
  }

  function saveTaskFromForm(event) {
    event.preventDefault();
    const title = elements.taskTitle.value.trim();
    if (!title) {
      showTitleError("Escribe un título para guardar la tarea.");
      elements.taskTitle.focus();
      return;
    }

    const existingIndex = state.tasks.findIndex(
      (task) => task.id === elements.taskId.value
    );
    const existing = existingIndex >= 0 ? state.tasks[existingIndex] : null;
    const task = {
      id: existing?.id || createTaskId(),
      title,
      description: elements.taskDescription.value.trim(),
      date: elements.taskDate.value || null,
      category: elements.taskCategory.value,
      priority: getRadioValue("priority"),
      status: getRadioValue("status"),
      order: existing?.order ?? nextOrder(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      state.tasks.splice(existingIndex, 1, task);
    } else {
      state.tasks.push(task);
    }

    persistState();
    closeTaskDrawer();
    render();
    showToast(existing ? "Tarea actualizada" : "Tarea creada y guardada");
  }

  function requestTaskDelete() {
    const task = state.tasks.find((item) => item.id === elements.taskId.value);
    if (!task) return;
    openConfirmDialog({
      title: "¿Eliminar esta tarea?",
      message: `“${task.title}” se eliminará de forma permanente.`,
      actionLabel: "Eliminar",
      onConfirm: () => {
        state.tasks = state.tasks.filter((item) => item.id !== task.id);
        persistState();
        closeTaskDrawer();
        render();
        showToast("Tarea eliminada");
      },
    });
  }

  function requestDemoReset() {
    openConfirmDialog({
      title: "¿Restaurar la demo?",
      message:
        "Se reemplazarán tus cambios por las tareas de ejemplo del mes actual.",
      actionLabel: "Restaurar",
      onConfirm: () => {
        const currentTheme = state.preferences.theme;
        state = storage.resetDemoData();
        state.preferences.theme = currentTheme;
        searchQuery = "";
        elements.taskSearch.value = "";
        viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        persistState();
        applyTheme();
        syncFilterControls();
        render();
        showToast("Datos de demostración restaurados");
      },
    });
  }

  function openConfirmDialog({ title, message, actionLabel, onConfirm }) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmAction.textContent = actionLabel;
    pendingConfirmation = onConfirm;
    if (!elements.confirmDialog.open) elements.confirmDialog.showModal();
    syncDialogState();
    window.setTimeout(() => elements.confirmCancel.focus(), 30);
  }

  function closeConfirmDialog() {
    if (elements.confirmDialog.open) elements.confirmDialog.close();
    pendingConfirmation = null;
    syncDialogState();
  }

  function runConfirmation() {
    const callback = pendingConfirmation;
    if (elements.confirmDialog.open) elements.confirmDialog.close();
    pendingConfirmation = null;
    callback?.();
    syncDialogState();
  }

  function handleDialogBackdropClick(event) {
    if (event.target === event.currentTarget) {
      if (event.currentTarget === elements.taskDrawer) closeTaskDrawer();
      if (event.currentTarget === elements.confirmDialog) closeConfirmDialog();
    }
  }

  function syncDialogState() {
    const hasOpenDialog = elements.taskDrawer.open || elements.confirmDialog.open;
    document.body.classList.toggle("has-dialog-open", hasOpenDialog);
  }

  function showTitleError(message) {
    elements.titleError.textContent = message;
    elements.taskTitle.closest(".field").classList.add("has-error");
    elements.taskTitle.setAttribute("aria-invalid", "true");
    elements.taskTitle.setAttribute("aria-describedby", "title-error");
  }

  function clearTitleError() {
    elements.titleError.textContent = "";
    elements.taskTitle.closest(".field").classList.remove("has-error");
    elements.taskTitle.removeAttribute("aria-invalid");
    elements.taskTitle.removeAttribute("aria-describedby");
  }

  function handleDragStart(event) {
    const card = event.target.closest(".task-card");
    if (!card) return;
    draggedTaskId = card.dataset.taskId;
    ignoreCardClick = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedTaskId);
    requestAnimationFrame(() => card.classList.add("is-dragging"));
    document.body.classList.add("is-dragging-task");
  }

  function handleDragEnd() {
    document.querySelectorAll(".task-card.is-dragging").forEach((card) => {
      card.classList.remove("is-dragging");
    });
    clearDropTargets();
    document.body.classList.remove("is-dragging-task");
    draggedTaskId = null;
    window.setTimeout(() => {
      ignoreCardClick = false;
    }, 80);
  }

  function handleCalendarDragOver(event) {
    if (!draggedTaskId) return;
    const day = event.target.closest(".calendar-day");
    if (!day) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    highlightDropTarget(day);
  }

  function handleCalendarDrop(event) {
    if (!draggedTaskId) return;
    const day = event.target.closest(".calendar-day");
    if (!day) return;
    event.preventDefault();
    const targetCard = event.target.closest(".task-card");
    moveTask(draggedTaskId, day.dataset.date, targetCard?.dataset.taskId);
  }

  function handleBacklogDragOver(event) {
    if (!draggedTaskId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    highlightDropTarget(elements.backlogList);
  }

  function handleBacklogDrop(event) {
    if (!draggedTaskId) return;
    event.preventDefault();
    const targetCard = event.target.closest(".task-card");
    moveTask(draggedTaskId, null, targetCard?.dataset.taskId);
  }

  function moveTask(taskId, newDate, targetTaskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    const previousDate = task.date;
    task.date = newDate;

    const destinationTasks = state.tasks
      .filter((item) => item.id !== taskId && item.date === newDate)
      .sort(sortTasks);
    const targetIndex = targetTaskId
      ? destinationTasks.findIndex((item) => item.id === targetTaskId)
      : -1;
    destinationTasks.splice(
      targetIndex >= 0 ? targetIndex : destinationTasks.length,
      0,
      task
    );
    destinationTasks.forEach((item, index) => {
      item.order = index;
    });

    persistState();
    render();
    clearDropTargets();

    if (newDate === null) {
      showToast("Tarea devuelta al backlog");
    } else if (previousDate === newDate) {
      showToast("Orden actualizado");
    } else {
      showToast(`Tarea movida al ${formatCompactDate(newDate)}`);
    }
  }

  function highlightDropTarget(target) {
    document.querySelectorAll(".drop-target").forEach((element) => {
      if (element !== target) element.classList.remove("drop-target");
    });
    target.classList.add("drop-target");
  }

  function clearDropTargets() {
    document.querySelectorAll(".drop-target").forEach((element) => {
      element.classList.remove("drop-target");
    });
  }

  function toggleTheme() {
    state.preferences.theme =
      state.preferences.theme === "dark" ? "light" : "dark";
    applyTheme();
    persistState();
    showToast(
      state.preferences.theme === "dark" ? "Tema oscuro activado" : "Tema claro activado"
    );
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.preferences.theme;
    elements.themeToggle.setAttribute(
      "aria-label",
      state.preferences.theme === "dark"
        ? "Activar tema claro"
        : "Activar tema oscuro"
    );
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        state.preferences.theme === "dark" ? "#10141d" : "#f1f2f5"
      );
  }

  function handleGlobalShortcuts(event) {
    const activeTag = document.activeElement?.tagName;
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);

    if (
      event.key === "/" &&
      !isTyping &&
      !elements.taskDrawer.open &&
      !elements.confirmDialog.open
    ) {
      event.preventDefault();
      elements.taskSearch.focus();
      return;
    }

    if (
      event.key.toLowerCase() === "n" &&
      !isTyping &&
      !elements.taskDrawer.open &&
      !elements.confirmDialog.open
    ) {
      event.preventDefault();
      openTaskDrawer();
      return;
    }

    if (
      event.key === "Enter" &&
      (event.metaKey || event.ctrlKey) &&
      elements.taskDrawer.open
    ) {
      event.preventDefault();
      elements.taskForm.requestSubmit();
    }
  }

  function setRadioValue(name, value) {
    const input = elements.taskForm.querySelector(
      `input[name="${name}"][value="${value}"]`
    );
    if (input) input.checked = true;
  }

  function getRadioValue(name) {
    return (
      elements.taskForm.querySelector(`input[name="${name}"]:checked`)?.value ||
      ""
    );
  }

  function persistState() {
    const saved = storage.saveState(state);
    if (!saved) showToast("No se pudo guardar. Revisa el espacio del navegador.");
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    elements.toastRegion.append(toast);

    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  function createTaskId() {
    return typeof crypto.randomUUID === "function"
      ? `task-${crypto.randomUUID()}`
      : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function nextOrder() {
    return Math.max(0, ...state.tasks.map((task) => task.order || 0)) + 1;
  }

  function findById(collection, id) {
    return collection.find((item) => item.id === id) || collection[0];
  }

  function normalizeText(value) {
    return value
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatCompactDate(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
    }).format(new Date(year, month - 1, day));
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function capitalize(value) {
    return value.charAt(0).toLocaleUpperCase("es") + value.slice(1);
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  initialize();
})();
