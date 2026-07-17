import type { StockFiltersDto } from "../../dto/stock.dto";

type Props = {
  filters: StockFiltersDto;
  onChange: (next: StockFiltersDto) => void;
};

export default function StockFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label htmlFor="stock-search" className="min-w-0 flex-1">
        <span className="mb-2 block text-xs font-semibold text-slate-600">
          Buscar en inventario
        </span>
        <span className="relative block">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="m21 21-4.35-4.35m1.35-5.4A6.75 6.75 0 1 1 4.5 11.25a6.75 6.75 0 0 1 13.5 0Z"
            />
          </svg>
          <input
            id="stock-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Descripción o referencia"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </span>
      </label>

      {filters.search ? (
        <button
          type="button"
          onClick={() => onChange({ ...filters, search: "" })}
          className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Limpiar
        </button>
      ) : null}
    </div>
  );
}
