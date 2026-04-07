import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type PickerItem = {
  id: number;
  descripcion: string;
  descripcionAmpliada?: string | null;
  ubicacion?: string | null;
  cantidad?: number;
  alias: string;
  codigo?: string | null;
  filterParam?: string;
};

interface MobileSearchPickerProps {
  items?: PickerItem[];
  onItemClick: (id: number, alias: string) => void;
  onClose: () => void;
  text?: string;
  compactMode?: boolean;
}

export default function MobileSearchPicker({
  items = [],
  onItemClick,
  onClose,
  text,
  compactMode = false,
}: MobileSearchPickerProps) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(items);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
      return;
    }

    const query = search.toLowerCase();

    setFiltered(
      items.filter((item) => {
        const source =
          item.filterParam ??
          [item.descripcion, item.descripcionAmpliada, item.alias, item.codigo]
            .filter(Boolean)
            .join(" ");

        return source.toLowerCase().includes(query);
      })
    );
  }, [search, items]);

  return (
    <div
      className="
        absolute inset-0 z-[75]
        bg-slate-900/40
        p-3
        backdrop-blur-[2px]
      "
    >
      <div
        className="
          flex h-full w-full flex-col overflow-hidden
          rounded-[1.75rem]
          border border-slate-200
          bg-white
          shadow-2xl
        "
      >
        <div className="border-b border-slate-100 px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {text || "Select item"}
            </h2>

            <button
              onClick={onClose}
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-full border border-slate-200
                bg-white text-slate-500
                transition hover:bg-slate-50 hover:text-slate-700
              "
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full rounded-xl border border-slate-200
                bg-slate-50 py-2.5 pl-10 pr-3
                text-sm text-slate-800 outline-none transition
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
              "
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onItemClick(item.id, item.alias)}
                  className="
                    group flex w-full gap-3 rounded-2xl
                    border border-slate-200 bg-white p-3 text-left
                    transition hover:-translate-y-[1px]
                    hover:bg-slate-50 hover:shadow-sm
                  "
                >
                  <div className="w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {item.alias}
                      </span>

                      {!compactMode && item.descripcion && (
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                          {item.descripcion}
                        </span>
                      )}
                    </div>

                    {item.descripcionAmpliada && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {item.descripcionAmpliada}
                      </p>
                    )}

                    {item.ubicacion && (
                      <div className="mt-1 flex items-center text-[11px] text-slate-400">
                        <MapPinIcon className="mr-1 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.ubicacion}</span>
                      </div>
                    )}

                    {typeof item.cantidad === "number" && (
                      <div className="mt-2 flex justify-end">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {item.cantidad}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}