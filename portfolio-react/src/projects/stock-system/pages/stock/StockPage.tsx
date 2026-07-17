import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeleteStockItemDialog from "../../components/stock/DeleteStockItemDialog";
import StockFilters from "../../components/stock/StockFilters";
import StockItemModal from "../../components/stock/StockItemModal";
import StockTable from "../../components/stock/StockTable";
import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import type {
  CreateStockItemDto,
  StockFiltersDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../../dto/stock.dto";
import { configurationService } from "../../services/configuration.sevice";
import { stockService } from "../../services/stock.service";

type MetricCardProps = {
  label: string;
  value: number;
  description: string;
  tone?: "blue" | "amber" | "slate";
};

function MetricCard({
  label,
  value,
  description,
  tone = "slate",
}: MetricCardProps) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-white text-slate-900",
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm sm:p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="pb-1 text-right text-xs leading-5 opacity-70">{description}</p>
      </div>
    </article>
  );
}

export default function StockPage() {
  const [items, setItems] = useState<StockItemDto[]>([]);
  const [configuration, setConfiguration] =
    useState<StockPageConfigurationDto | null>(null);
  const [filters, setFilters] = useState<StockFiltersDto>({ search: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItemDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StockItemDto | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const [itemsData, configurationData] = await Promise.all([
        stockService.getAll(),
        configurationService.get(),
      ]);

      setItems(itemsData);
      setConfiguration(configurationData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      setLoadError("No se ha podido cargar el inventario. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const text = filters.search.trim().toLowerCase();
    if (!text) return items;

    return items.filter(
      (item) =>
        item.description.toLowerCase().includes(text) ||
        item.reference.toLowerCase().includes(text)
    );
  }, [filters.search, items]);

  const lowStockCount = useMemo(
    () => items.filter((item) => item.quantity <= item.minStock).length,
    [items]
  );

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
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } else {
      const created = await stockService.create(payload);
      setItems((current) => [created, ...current]);
    }

    setLastUpdated(new Date());
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;
    await stockService.remove(deletingItem.id);
    setItems((current) =>
      current.filter((item) => item.id !== deletingItem.id)
    );
    setDeletingItem(null);
    setLastUpdated(new Date());
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              aria-label="Volver al portfolio"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ←
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold sm:text-base">
                  Inventory Control
                </h1>
                <span className="hidden rounded border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-200 sm:inline-flex">
                  Demo
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                Gestión operativa de existencias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-slate-300 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Sistema operativo
            </span>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:px-4"
            >
              <span className="text-lg leading-none" aria-hidden="true">+</span>
              <span className="hidden sm:inline">Nuevo artículo</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              Operaciones · Inventario
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Gestión de stock
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Consulta existencias, controla mínimos y mantén actualizada la información de cada artículo.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            {lastUpdated
              ? `Actualizado ${lastUpdated.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Pendiente de sincronización"}
          </p>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-3" aria-label="Resumen de inventario">
          <MetricCard label="Total artículos" value={items.length} description="Registros activos" />
          <MetricCard label="Stock bajo" value={lowStockCount} description="Requieren revisión" tone={lowStockCount > 0 ? "amber" : "slate"} />
          <MetricCard label="Resultado actual" value={filteredItems.length} description="Según el filtro" tone="blue" />
        </section>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <StockFilters filters={filters} onChange={setFilters} />
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h3 className="font-semibold text-slate-950">Artículos</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {loading
                  ? "Sincronizando datos…"
                  : `${filteredItems.length} ${
                      filteredItems.length === 1 ? "registro" : "registros"
                    }`}
              </p>
            </div>
            {!loading && !loadError ? (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Datos sincronizados
              </span>
            ) : null}
          </div>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12" role="status">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm font-semibold text-slate-700">Cargando inventario</p>
              <p className="mt-1 text-xs text-slate-500">Consultando el origen de datos</p>
            </div>
          ) : loadError ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
              <h3 className="font-semibold text-slate-950">No se pueden mostrar los datos</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-5 h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reintentar
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-500">□</div>
              <h3 className="mt-4 font-semibold text-slate-950">Sin resultados</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                {filters.search
                  ? "No hay artículos que coincidan con la búsqueda."
                  : "Todavía no hay artículos en el inventario."}
              </p>
              {!filters.search ? (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-5 h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Crear primer artículo
                </button>
              ) : null}
            </div>
          ) : (
            <StockTable
              items={filteredItems}
              configuration={configuration}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}
        </section>

        <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Inventory Control · Entorno demostrativo</span>
          <span>{new Date().toLocaleDateString("es-ES", { dateStyle: "long" })}</span>
        </footer>
      </main>

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
