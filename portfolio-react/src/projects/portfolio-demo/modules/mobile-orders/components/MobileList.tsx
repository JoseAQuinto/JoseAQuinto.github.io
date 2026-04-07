import type { MobileListItem } from "../mobileOrders.types";

interface MobileListProps {
  items: MobileListItem[];
  onItemClick?: (item: MobileListItem) => void;
}

function getStatusClasses(status?: string) {
  if (status === "Pending") {
    return "bg-sky-100 text-sky-700 border border-sky-200";
  }

  if (status === "In Progress") {
    return "bg-amber-100 text-amber-700 border border-amber-200";
  }

  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }

  return "bg-slate-100 text-slate-600 border border-slate-200";
}

export default function MobileList({ items, onItemClick }: MobileListProps) {
  const chipBaseClasses =
    "inline-flex max-w-[70%] items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-600";

  return (
    <div className="mx-auto max-w-[430px] p-1 pb-2">
      {items.map((item, index) => (
        <button
          key={item.id ?? index}
          type="button"
          onClick={() => onItemClick?.(item)}
          className="
            mb-3 flex w-full flex-col rounded-[1.25rem]
            border border-slate-200
            bg-white p-4 text-left
            shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-18px_rgba(15,23,42,0.24)]
            transition
            hover:-translate-y-[1px]
            hover:shadow-md
          "
        >
          {/* Header */}
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="min-w-0 flex-1 truncate pr-2 text-[15px] font-semibold tracking-tight text-slate-900">
              {item.title}
            </span>

            {item.status && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="mt-1 flex items-center justify-between gap-3 text-[13px] text-slate-500">
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.description}
            </span>

            {item.date && (
              <span
                className="shrink-0 text-xs font-medium text-slate-700"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.date}
              </span>
            )}
          </div>

          {/* Footer */}
          {(item.client || item.location) && (
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-3">
              {item.client && <span className={chipBaseClasses}>{item.client}</span>}
              {item.location && <span className={chipBaseClasses}>{item.location}</span>}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}