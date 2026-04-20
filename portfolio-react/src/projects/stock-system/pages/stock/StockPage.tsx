import { useEffect, useMemo, useState } from "react";
import StockFilters from "../../components/stock/StockFilters";
import StockItemModal from "../../components/stock/StockItemModal";
import StockTable from "../../components/stock/StockTable";
import DeleteStockItemDialog from "../../components/stock/DeleteStockItemDialog";
import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import type {
  CreateStockItemDto,
  StockFiltersDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../../dto/stock.dto";

import { stockService } from "../../services/stock.service";
import { configurationService } from "../../services/configuration.sevice";

export default function StockPage() {
  const [items, setItems] = useState<StockItemDto[]>([]);
  const [configuration, setConfiguration] =
    useState<StockPageConfigurationDto | null>(null);
  const [filters, setFilters] = useState<StockFiltersDto>({ search: "" });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItemDto | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StockItemDto | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [itemsData, configurationData] = await Promise.all([
        stockService.getAll(),
        configurationService.get(),
      ]);

      setItems(itemsData);
      setConfiguration(configurationData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const text = filters.search.trim().toLowerCase();

    if (!text) return items;

    return items.filter(
      (item) =>
        item.description.toLowerCase().includes(text) ||
        item.reference.toLowerCase().includes(text)
    );
  }, [items, filters]);

  function handleOpenCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function handleOpenEdit(item: StockItemDto) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function handleOpenDelete(item: StockItemDto) {
    setDeletingItem(item);
    setDeleteOpen(true);
  }

  async function handleSave(payload: CreateStockItemDto | UpdateStockItemDto) {
    if ("id" in payload) {
      const updated = await stockService.update(payload);
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      return;
    }

    const created = await stockService.create(payload);
    setItems((prev) => [created, ...prev]);
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;

    await stockService.remove(deletingItem.id);
    setItems((prev) => prev.filter((x) => x.id !== deletingItem.id));
    setDeletingItem(null);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Stock</h1>
          <p style={{ marginTop: 8, color: "#6b7280" }}>
            Gestión básica de artículos con Supabase
          </p>
        </div>

        <button onClick={handleOpenCreate} style={primaryBtnStyle}>
          Nuevo artículo
        </button>
      </div>

      <StockFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <StockTable
          items={filteredItems}
          configuration={configuration}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <StockItemModal
        open={modalOpen}
        item={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteStockItemDialog
        open={deleteOpen}
        item={deletingItem}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const primaryBtnStyle: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
};