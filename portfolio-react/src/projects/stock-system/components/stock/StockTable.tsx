import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import type { StockItemDto } from "../../dto/stock.dto";

type Props = {
  items: StockItemDto[];
  configuration: StockPageConfigurationDto | null;
  onEdit: (item: StockItemDto) => void;
  onDelete: (item: StockItemDto) => void;
};

function StockStatus({ item }: { item: StockItemDto }) {
  const isLow = item.quantity <= item.minStock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isLow
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLow ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {item.quantity}
    </span>
  );
}

function RowActions({
  item,
  onEdit,
  onDelete,
}: {
  item: StockItemDto;
  onEdit: Props["onEdit"];
  onDelete: Props["onDelete"];
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        aria-label={`Eliminar ${item.description}`}
        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Eliminar
      </button>
    </div>
  );
}

export default function StockTable({
  items,
  configuration,
  onEdit,
  onDelete,
}: Props) {
  const showReference = configuration?.showReferenceColumn !== false;
  const showLastModified = configuration?.showLastModifiedColumn !== false;
  const showMinStock = configuration?.showMinStockColumn !== false;

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Artículo
              </th>
              {showReference ? (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Referencia
                </th>
              ) : null}
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>
              {showMinStock ? (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mínimo
                </th>
              ) : null}
              {showLastModified ? (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actualización
                </th>
              ) : null}
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{item.description}</p>
                </td>
                {showReference ? (
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">
                    {item.reference}
                  </td>
                ) : null}
                <td className="px-5 py-4">
                  <StockStatus item={item} />
                </td>
                {showMinStock ? (
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-600">
                    {item.minStock}
                  </td>
                ) : null}
                {showLastModified ? (
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                    {new Date(item.lastModified).toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                ) : null}
                <td className="px-5 py-4">
                  <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-200 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{item.description}</h3>
                {showReference ? (
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">
                    {item.reference}
                  </p>
                ) : null}
              </div>
              <StockStatus item={item} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
              {showMinStock ? (
                <div>
                  <dt className="text-xs text-slate-500">Stock mínimo</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{item.minStock}</dd>
                </div>
              ) : null}
              {showLastModified ? (
                <div>
                  <dt className="text-xs text-slate-500">Actualizado</dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {new Date(item.lastModified).toLocaleDateString("es-ES")}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-4">
              <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
