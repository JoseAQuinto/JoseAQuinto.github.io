import type { ApiEndpoint } from "../types/api";
import StatusBadge from "./StatusBadge";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  endpoints: ApiEndpoint[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function UtilitySidebar({
  endpoints,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside className="rounded-[30px] border border-[#e5dfd6] bg-white/88 p-4 backdrop-blur-sm">
      <div className="mb-4 px-1">
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-[#9b948a]"
          style={{ fontFamily: editorialFont }}
        >
          Endpoints
        </p>
      </div>

      <div className="space-y-3">
        {endpoints.map((endpoint) => {
          const isActive = selectedId === endpoint.id;

          return (
            <button
              key={endpoint.id}
              type="button"
              onClick={() => onSelect(endpoint.id)}
              className={`w-full rounded-[22px] border p-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-[#cfc6ba] bg-[#f9f7f4] shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                  : "border-[#e7e0d7] bg-[#fbfaf7] hover:border-[#d7cfc5] hover:bg-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <StatusBadge method={endpoint.method} />
                <span
                  className="text-[10px] uppercase tracking-[0.16em] text-[#a09890]"
                  style={{ fontFamily: editorialFont }}
                >
                  {endpoint.section === "crud" ? "database" : "utility"}
                </span>
              </div>

              <p
                className="mt-3 text-[15px] font-normal leading-[1.5] text-[#171717]"
                style={{ fontFamily: editorialFont }}
              >
                {endpoint.title}
              </p>

              <p className="mt-2 text-xs text-[#8f887f]">{endpoint.path}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}