import type { StockPageConfigurationDto } from "../../dto/configuration.dto";

type Props = {
  value: StockPageConfigurationDto;
  onChange: (next: StockPageConfigurationDto) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function StockDisplaySettingsForm({
  value,
  onChange,
  onSave,
  saving,
}: Props) {
  return (
    <div style={cardStyle}>
      <label style={rowStyle}>
        <input
          type="checkbox"
          checked={value.showReferenceColumn}
          onChange={(e) =>
            onChange({
              ...value,
              showReferenceColumn: e.target.checked,
            })
          }
        />
        <span>Mostrar columna Referencia</span>
      </label>

      <label style={rowStyle}>
        <input
          type="checkbox"
          checked={value.showLastModifiedColumn}
          onChange={(e) =>
            onChange({
              ...value,
              showLastModifiedColumn: e.target.checked,
            })
          }
        />
        <span>Mostrar columna Última fecha modif</span>
      </label>

      <label style={rowStyle}>
        <input
          type="checkbox"
          checked={value.showMinStockColumn}
          onChange={(e) =>
            onChange({
              ...value,
              showMinStockColumn: e.target.checked,
            })
          }
        />
        <span>Mostrar columna Stock mínimo</span>
      </label>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => void onSave()} disabled={saving} style={buttonStyle}>
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 20,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};