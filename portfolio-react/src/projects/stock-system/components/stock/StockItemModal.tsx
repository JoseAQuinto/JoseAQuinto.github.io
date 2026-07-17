import { useEffect, useId, useState } from "react";
import type {
  CreateStockItemDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../../dto/stock.dto";

type Props = {
  open: boolean;
  item: StockItemDto | null;
  onClose: () => void;
  onSave: (payload: CreateStockItemDto | UpdateStockItemDto) => Promise<void>;
};

type FormState = {
  description: string;
  reference: string;
  quantity: string;
  minStock: string;
};

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function getInitialForm(item: StockItemDto | null): FormState {
  return item
    ? {
        description: item.description,
        reference: item.reference,
        quantity: String(item.quantity),
        minStock: String(item.minStock),
      }
    : {
        description: "",
        reference: "",
        quantity: "",
        minStock: "",
      };
}

type ModalContentProps = Omit<Props, "open">;

function ModalContent({ item, onClose, onSave }: ModalContentProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(item));
  const [saving, setSaving] = useState(false);
  const titleId = useId();
  const isEdit = Boolean(item);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        description: form.description.trim(),
        reference: form.reference.trim(),
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
      };

      await onSave(isEdit && item ? { id: item.id, ...payload } : payload);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="relative mx-auto my-[max(1rem,6vh)] w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              Inventario
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-slate-950">
              {isEdit ? "Editar artículo" : "Nuevo artículo"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa los datos operativos del artículo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Descripción</span>
              <input
                autoFocus
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Referencia</span>
              <input
                value={form.reference}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reference: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">Cantidad</span>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">Stock mínimo</span>
              <input
                type="number"
                min={0}
                value={form.minStock}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    minStock: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear artículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StockItemModal({ open, item, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <ModalContent
      key={item?.id ?? "new-item"}
      item={item}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
