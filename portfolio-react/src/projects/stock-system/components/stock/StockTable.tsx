import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import type { StockItemDto } from "../../dto/stock.dto";

type Props = {
  items: StockItemDto[];
  configuration: StockPageConfigurationDto | null;
  onEdit: (item: StockItemDto) => void;
  onDelete: (item: StockItemDto) => void;
};

export default function StockTable({
  items,
  configuration,
  onEdit,
  onDelete,
}: Props) {
  const showReference = configuration?.showReferenceColumn !== false;
  const showLastModified = configuration?.showLastModifiedColumn !== false;
  const showMinStock = configuration?.showMinStockColumn !== false;

  const visibleColumns =
    2 +
    (showReference ? 1 : 0) +
    (showLastModified ? 1 : 0) +
    (showMinStock ? 1 : 0);

  return (
    <div style={wrapperStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Descripción</th>
            {showReference && <th style={thStyle}>Referencia</th>}
            {showLastModified && <th style={thStyle}>Última fecha modif</th>}
            <th style={thStyle}>Cantidad</th>
            {showMinStock && <th style={thStyle}>Stock mínimo</th>}
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns} style={emptyStyle}>
                No hay artículos
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} style={rowStyle}>
                <td style={tdStyle}>{item.description}</td>
                {showReference && <td style={tdStyle}>{item.reference}</td>}
                {showLastModified && (
                  <td style={tdStyle}>
                    {new Date(item.lastModified).toLocaleString("es-ES")}
                  </td>
                )}
                <td style={tdStyle}>{item.quantity}</td>
                {showMinStock && <td style={tdStyle}>{item.minStock}</td>}
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onEdit(item)} style={editBtnStyle}>
                      Editar
                    </button>
                    <button onClick={() => onDelete(item)} style={deleteBtnStyle}>
                      X
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
  background: "#fff",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle: React.CSSProperties = {
  background: "#f9fafb",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: 14,
  fontSize: 14,
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: 14,
  fontSize: 14,
};

const rowStyle: React.CSSProperties = {
  borderTop: "1px solid #f1f5f9",
};

const emptyStyle: React.CSSProperties = {
  padding: 20,
  textAlign: "center",
};

const editBtnStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#b91c1c",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};