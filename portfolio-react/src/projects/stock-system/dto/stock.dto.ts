export type StockItemDto = {
  id: number;
  description: string;
  reference: string;
  lastModified: string;
  quantity: number;
  minStock: number;
};

export type CreateStockItemDto = {
  description: string;
  reference: string;
  quantity: number;
  minStock: number;
};

export type UpdateStockItemDto = {
  id: number;
  description: string;
  reference: string;
  quantity: number;
  minStock: number;
};

export type StockFiltersDto = {
  search: string;
};