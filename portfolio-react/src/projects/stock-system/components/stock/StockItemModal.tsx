import { useEffect, useState } from "react";
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

const emptyForm: FormState = {
  description: "",
  reference: "",
  quantity: "",
  minStock: "",
};

export default function StockItemModal({
  open,
  item,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!item) {
      setForm(emptyForm);
      return;
    }

    setForm({
      description: item.description,
      reference: item.reference,
      quantity: String(item.quantity),
      minStock: String(item.minStock),
    });
  }, [item, open]);

  if (!open) return null;

  const isEdit = !!item;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    try {
      const basePayload = {
        description: form.description.trim(),
        reference: form.reference.trim(),
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
      };

      if (isEdit && item) {
        await onSave({
          id: item.id,
          ...basePayload,
        });
      } else {
        await onSave(basePayload);
      }

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>
            {isEdit ? "Modificar artículo" : "Nuevo artículo"}
          </h2>
          <button onClick={onClose} style={closeBtnStyle}>
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Descripción</label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Referencia</label>
            <input
              value={form.reference}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, reference: e.target.value }))
              }
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Cantidad</label>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, quantity: e.target.value }))
              }
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Stock mínimo</label>
            <input
              type="number"
              min={0}
              value={form.minStock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, minStock: e.target.value }))
              }
              required
              style={inputStyle}
            />
          </div>

          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={primaryBtnStyle}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 14,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  marginTop: 20,
};

const primaryBtnStyle: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};

const closeBtnStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
};