(function () {
  "use strict";

  const STORAGE_KEY = "portfolio_visual_planner_v1";
  const VERSION = 1;

  function getDefaultTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function createInitialState() {
    return {
      version: VERSION,
      tasks: window.VisualPlannerData.createDemoTasks(),
      preferences: {
        theme: getDefaultTheme(),
        statusFilter: "all",
        categoryFilter: "all",
      },
    };
  }

  function isValidTask(task) {
    return (
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      (task.date === null || typeof task.date === "string")
    );
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return createInitialState();

      const parsed = JSON.parse(stored);
      if (
        parsed?.version !== VERSION ||
        !Array.isArray(parsed.tasks) ||
        !parsed.tasks.every(isValidTask)
      ) {
        return createInitialState();
      }

      return {
        version: VERSION,
        tasks: parsed.tasks,
        preferences: {
          theme: parsed.preferences?.theme === "light" ? "light" : "dark",
          statusFilter: parsed.preferences?.statusFilter || "all",
          categoryFilter: parsed.preferences?.categoryFilter || "all",
        },
      };
    } catch (error) {
      console.warn("No se pudo recuperar el estado del planner.", error);
      return createInitialState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: VERSION,
          tasks: state.tasks,
          preferences: state.preferences,
        })
      );
      return true;
    } catch (error) {
      console.warn("No se pudo guardar el estado del planner.", error);
      return false;
    }
  }

  function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    return createInitialState();
  }

  window.VisualPlannerStorage = Object.freeze({
    STORAGE_KEY,
    loadState,
    saveState,
    resetDemoData,
  });
})();
