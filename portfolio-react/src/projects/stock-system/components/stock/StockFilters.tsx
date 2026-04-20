import type { StockFiltersDto } from "../../dto/stock.dto";

type Props = {
  filters: StockFiltersDto;
  onChange: (next: StockFiltersDto) => void;
};

export default function StockFilters({ filters, onChange }: Props) {
  return (
    <div style={containerStyle}>
      <label htmlFor="stock-search" style={labelStyle}>
        Buscar
      </label>

      <input
        id="stock-search"
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        placeholder="Buscar por descripción o referencia"
        style={inputStyle}
      />
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
};