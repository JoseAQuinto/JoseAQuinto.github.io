import type { ApiEndpoint } from "../types/api";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";
import StatusBadge from "./StatusBadge";

type Props = {
  endpoints: ApiEndpoint[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function UtilitySidebar({ endpoints, selectedId, onSelect }: Props) {
  const { t } = useApiUtilitiesLanguage();

  return (
    <aside className="min-w-0 xl:sticky xl:top-21 xl:self-start">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t.endpoints}
        </p>
        <span className="text-xs tabular-nums text-slate-400">{endpoints.length}</span>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2 xl:max-h-[calc(100vh-7.5rem)] xl:flex-col xl:overflow-x-hidden xl:overflow-y-auto xl:pr-1">
        {endpoints.map((endpoint) => {
          const active = selectedId === endpoint.id;
          return (
            <button
              key={endpoint.id}
              type="button"
              onClick={() => onSelect(endpoint.id)}
              className={`w-[min(82vw,300px)] shrink-0 snap-start rounded-xl border p-4 text-left transition xl:w-full ${
                active
                  ? "border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <StatusBadge method={endpoint.method} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {endpoint.section === "crud" ? t.databaseLabel : t.utilityLabel}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                {endpoint.title}
              </p>
              <code className="mt-2 block truncate text-xs text-slate-500">
                {endpoint.path}
              </code>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
