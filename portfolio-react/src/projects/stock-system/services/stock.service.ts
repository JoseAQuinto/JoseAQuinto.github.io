import type {
  CreateStockItemDto,
  StockItemDto,
  UpdateStockItemDto,
} from "../dto/stock.dto";
import { hasSupabaseEnv, supabase } from "./supabaseClient";

const STORAGE_KEY = "portfolio-stock-items";

const defaultItems: StockItemDto[] = [
  {
    id: 1,
    description: "Monitor 24 pulgadas",
    reference: "MON-24-001",
    lastModified: new Date().toISOString(),
    quantity: 18,
    minStock: 5,
  },
  {
    id: 2,
    description: "Teclado mecánico",
    reference: "TEC-MEC-014",
    lastModified: new Date().toISOString(),
    quantity: 7,
    minStock: 3,
  },
  {
    id: 3,
    description: "Ratón inalámbrico",
    reference: "RAT-WLS-022",
    lastModified: new Date().toISOString(),
    quantity: 25,
    minStock: 10,
  },
];

function readLocalItems(): StockItemDto[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StockItemDto[]) : defaultItems;
  } catch {
    return defaultItems;
  }
}

function persistLocalItems(items: StockItemDto[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let mockItems = readLocalItems();

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
    if (!hasSupabaseEnv || !supabase) {
      return [...mockItems];
    }

    // Supabase implementation retained as a reference. This branch is disabled
    // by SUPABASE_CONNECTION_ENABLED in supabaseClient.ts for the public demo.
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
    if (!hasSupabaseEnv || !supabase) {
      const newItem: StockItemDto = {
        id: Date.now(),
        description: payload.description,
        reference: payload.reference,
        quantity: payload.quantity,
        minStock: payload.minStock,
        lastModified: new Date().toISOString(),
      };

      mockItems = [newItem, ...mockItems];
      persistLocalItems(mockItems);
      return newItem;
    }

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
    if (!hasSupabaseEnv || !supabase) {
      const updated: StockItemDto = {
        id: payload.id,
        description: payload.description,
        reference: payload.reference,
        quantity: payload.quantity,
        minStock: payload.minStock,
        lastModified: new Date().toISOString(),
      };

      mockItems = mockItems.map((x) => (x.id === payload.id ? updated : x));
      persistLocalItems(mockItems);
      return updated;
    }

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
    if (!hasSupabaseEnv || !supabase) {
      mockItems = mockItems.filter((x) => x.id !== id);
      persistLocalItems(mockItems);
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};

// import { supabase } from "./supabaseClient";
// import type {
//   CreateStockItemDto,
//   StockItemDto,
//   UpdateStockItemDto,
// } from "../dto/stock.dto";

// type StockRow = {
//   id: number;
//   description: string;
//   reference: string;
//   last_modified: string;
//   quantity: number;
//   min_stock: number;
// };

// function mapRow(row: StockRow): StockItemDto {
//   return {
//     id: row.id,
//     description: row.description,
//     reference: row.reference,
//     lastModified: row.last_modified,
//     quantity: row.quantity,
//     minStock: row.min_stock,
//   };
// }

// export const stockService = {
//   async getAll(): Promise<StockItemDto[]> {
//     const { data, error } = await supabase
//       .from("products")
//       .select("*")
//       .order("id", { ascending: false });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return (data as StockRow[]).map(mapRow);
//   },

//   async create(payload: CreateStockItemDto): Promise<StockItemDto> {
//     const { data, error } = await supabase
//       .from("products")
//       .insert({
//         description: payload.description,
//         reference: payload.reference,
//         quantity: payload.quantity,
//         min_stock: payload.minStock,
//         last_modified: new Date().toISOString(),
//       })
//       .select()
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return mapRow(data as StockRow);
//   },

//   async update(payload: UpdateStockItemDto): Promise<StockItemDto> {
//     const { data, error } = await supabase
//       .from("products")
//       .update({
//         description: payload.description,
//         reference: payload.reference,
//         quantity: payload.quantity,
//         min_stock: payload.minStock,
//         last_modified: new Date().toISOString(),
//       })
//       .eq("id", payload.id)
//       .select()
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return mapRow(data as StockRow);
//   },

//   async remove(id: number): Promise<void> {
//     const { error } = await supabase.from("products").delete().eq("id", id);

//     if (error) {
//       throw new Error(error.message);
//     }
//   },
// };
