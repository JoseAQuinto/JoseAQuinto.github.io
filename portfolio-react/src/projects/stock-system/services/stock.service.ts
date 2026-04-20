import { supabase } from "./supabaseClient";
import type {
  CreateStockItemDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../dto/stock.dto";

type StockRow = {
  id: number;
  description: string;
  reference: string;
  last_modified: string;
  quantity: number;
  min_stock: number;
};

function mapRow(row: StockRow): StockItemDto {
  return {
    id: row.id,
    description: row.description,
    reference: row.reference,
    lastModified: row.last_modified,
    quantity: row.quantity,
    minStock: row.min_stock,
  };
}

export const stockService = {
  async getAll(): Promise<StockItemDto[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as StockRow[]).map(mapRow);
  },

  async create(payload: CreateStockItemDto): Promise<StockItemDto> {
    const { data, error } = await supabase
      .from("products")
      .insert({
        description: payload.description,
        reference: payload.reference,
        quantity: payload.quantity,
        min_stock: payload.minStock,
        last_modified: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRow(data as StockRow);
  },

  async update(payload: UpdateStockItemDto): Promise<StockItemDto> {
    const { data, error } = await supabase
      .from("products")
      .update({
        description: payload.description,
        reference: payload.reference,
        quantity: payload.quantity,
        min_stock: payload.minStock,
        last_modified: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRow(data as StockRow);
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};