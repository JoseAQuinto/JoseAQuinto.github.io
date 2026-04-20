import type { StockItemDto } from "../../dto/stock.dto";

type Props = {
  open: boolean;
  item: StockItemDto | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteStockItemDialog({
  open,
  item,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !item) return null;

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h3 style={{ marginTop: 0 }}>Eliminar artículo</h3>
        <p>
          ¿Seguro que quieres eliminar <strong>{item.description}</strong>?
        </p>

        <div style={actionsStyle}>
          <button onClick={onClose} style={secondaryBtnStyle}>
            Cancelar
          </button>
          <button
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            style={dangerBtnStyle}
          >
            Eliminar
          </button>
        </div>
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
  zIndex: 1100,
};

const dialogStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
};

const secondaryBtnStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};

const dangerBtnStyle: React.CSSProperties = {
  border: "none",
  background: "#b91c1c",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};