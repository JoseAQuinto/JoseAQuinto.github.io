import { useEffect, useMemo, useState } from "react";
import StockFilters from "../../components/stock/StockFilters";
import StockItemModal from "../../components/stock/StockItemModal";
import StockTable from "../../components/stock/StockTable";
import DeleteStockItemDialog from "../../components/stock/DeleteStockItemDialog";
import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import type {
  CreateStockItemDto,
  StockFiltersDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../../dto/stock.dto";

import { stockService } from "../../services/stock.service";
import { configurationService } from "../../services/configuration.sevice";

export default function StockPage() {
  const [items, setItems] = useState<StockItemDto[]>([]);
  const [configuration, setConfiguration] =
    useState<StockPageConfigurationDto | null>(null);
  const [filters, setFilters] = useState<StockFiltersDto>({ search: "" });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItemDto | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StockItemDto | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [itemsData, configurationData] = await Promise.all([
        stockService.getAll(),
        configurationService.get(),
      ]);

      setItems(itemsData);
      setConfiguration(configurationData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const text = filters.search.trim().toLowerCase();

    if (!text) return items;

    return items.filter(
      (item) =>
        item.description.toLowerCase().includes(text) ||
        item.reference.toLowerCase().includes(text)
    );
  }, [items, filters]);

  function handleOpenCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function handleOpenEdit(item: StockItemDto) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function handleOpenDelete(item: StockItemDto) {
    setDeletingItem(item);
    setDeleteOpen(true);
  }

  async function handleSave(payload: CreateStockItemDto | UpdateStockItemDto) {
    if ("id" in payload) {
      const updated = await stockService.update(payload);
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      return;
    }

    const created = await stockService.create(payload);
    setItems((prev) => [created, ...prev]);
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;

    await stockService.remove(deletingItem.id);
    setItems((prev) => prev.filter((x) => x.id !== deletingItem.id));
    setDeletingItem(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Decorative background elements - más sutiles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-200/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Enterprise Inventory
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg shadow-indigo-500/25">
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Gestión de Stock
                  </h1>
                  <p className="mt-1 text-slate-600">
                    Administra tu inventario con precisión y control total
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden h-12 w-px bg-slate-300 lg:block" />
              
              <button
                onClick={handleOpenCreate}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <svg
                  className="relative h-5 w-5 transition-transform group-hover:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="relative">Nuevo Artículo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Artículos
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {items.length}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-indigo-50 px-2.5 py-1.5">
                <span className="text-xs font-medium text-indigo-700">Stock</span>
              </div>
            </div>
            
            <div className="relative mt-4">
              <div className="h-1 w-full rounded-full bg-slate-200">
                <div className="h-1 w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Visibles
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {filteredItems.length}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-blue-50 px-2.5 py-1.5">
                <span className="text-xs font-medium text-blue-700">Filtro</span>
              </div>
            </div>
            
            <div className="relative mt-4">
              <div className="h-1 w-full rounded-full bg-slate-200">
                <div 
                  className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${items.length ? (filteredItems.length / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Disponibles
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {items.filter(i => i.quantity > 0).length}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-emerald-50 px-2.5 py-1.5">
                <span className="text-xs font-medium text-emerald-700">Activo</span>
              </div>
            </div>
            
            <div className="relative mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
              <span className="text-xs text-slate-500">Sistema operativo</span>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Última Actualización
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-amber-50 px-2.5 py-1.5">
                <span className="text-xs font-medium text-amber-700">Ahora</span>
              </div>
            </div>
            
            <div className="relative mt-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs text-slate-500">Sincronizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Filtros de búsqueda
                </span>
              </div>
            </div>
            <div className="p-5">
              <StockFilters filters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                  <svg
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Listado de Artículos
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {loading
                      ? "Procesando datos..."
                      : `${filteredItems.length} ${
                          filteredItems.length === 1 ? "registro encontrado" : "registros encontrados"
                        }`}
                  </p>
                </div>
              </div>
              
              {!loading && filteredItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Vista actualizada
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <div className="relative">
                  <div className="h-16 w-16 animate-spin rounded-full border-3 border-slate-200 border-t-indigo-600" />
                  <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-2 border-indigo-300/30" />
                </div>
                <p className="mt-6 text-sm font-medium text-slate-700">
                  Cargando inventario
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Obteniendo datos del sistema...
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                  <svg
                    className="h-10 w-10 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                  No hay artículos disponibles
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {filters.search 
                    ? "No se encontraron resultados para tu búsqueda" 
                    : "Comienza agregando tu primer artículo al inventario"}
                </p>
                {!filters.search && (
                  <button
                    onClick={handleOpenCreate}
                    className="mt-8 group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <svg
                      className="relative h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="relative">Crear primer artículo</span>
                  </button>
                )}
              </div>
            ) : (
              <StockTable
                items={filteredItems}
                configuration={configuration}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            )}
          </div>
        </div>

        {/* Footer subtle info */}
        <div className="mt-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sistema activo
            </span>
            <span className="h-3 w-px bg-slate-300" />
            <span>v2.1.0 Enterprise</span>
          </div>
          <div className="text-slate-500">
            {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <StockItemModal
        open={modalOpen}
        item={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteStockItemDialog
        open={deleteOpen}
        item={deletingItem}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}