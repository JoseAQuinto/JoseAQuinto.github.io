import type { StockPageConfigurationDto } from "../dto/configuration.dto";
import { hasSupabaseEnv, supabase } from "./supabaseClient";

const STORAGE_KEY = "portfolio-stock-configuration";

const defaultConfiguration: StockPageConfigurationDto = {
  id: 1,
  showReferenceColumn: true,
  showLastModifiedColumn: true,
  showMinStockColumn: true,
  updatedAt: new Date().toISOString(),
};

function readLocalConfiguration(): StockPageConfigurationDto {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? (JSON.parse(saved) as StockPageConfigurationDto)
      : defaultConfiguration;
  } catch {
    return defaultConfiguration;
  }
}

let mockConfiguration = readLocalConfiguration();

type ConfigurationRow = {
  id: number;
  show_reference_column: boolean;
  show_last_modified_column: boolean;
  show_min_stock_column: boolean;
  updated_at: string;
};

function mapRow(row: ConfigurationRow): StockPageConfigurationDto {
  return {
    id: row.id,
    showReferenceColumn: row.show_reference_column,
    showLastModifiedColumn: row.show_last_modified_column,
    showMinStockColumn: row.show_min_stock_column,
    updatedAt: row.updated_at,
  };
}

export const configurationService = {
  async get(): Promise<StockPageConfigurationDto | null> {
    if (!hasSupabaseEnv || !supabase) {
      return { ...mockConfiguration };
    }

    // Supabase implementation retained as a reference. This branch is disabled
    // by SUPABASE_CONNECTION_ENABLED in supabaseClient.ts for the public demo.
    const { data, error } = await supabase
      .from("dashboard_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) return null;

    return mapRow(data as ConfigurationRow);
  },

  async save(
    payload: StockPageConfigurationDto
  ): Promise<StockPageConfigurationDto> {
    if (!hasSupabaseEnv || !supabase) {
      mockConfiguration = {
        ...payload,
        id: mockConfiguration.id ?? 1,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockConfiguration));

      return { ...mockConfiguration };
    }

    const current = await this.get();

    if (!current?.id) {
      const { data, error } = await supabase
        .from("dashboard_settings")
        .insert({
          show_reference_column: payload.showReferenceColumn,
          show_last_modified_column: payload.showLastModifiedColumn,
          show_min_stock_column: payload.showMinStockColumn,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapRow(data as ConfigurationRow);
    }

    const { data, error } = await supabase
      .from("dashboard_settings")
      .update({
        show_reference_column: payload.showReferenceColumn,
        show_last_modified_column: payload.showLastModifiedColumn,
        show_min_stock_column: payload.showMinStockColumn,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRow(data as ConfigurationRow);
  },
};

// import type { StockPageConfigurationDto } from "../dto/configuration.dto";
// import { supabase } from "./supabaseClient";

// type ConfigurationRow = {
//   id: number;
//   show_reference_column: boolean;
//   show_last_modified_column: boolean;
//   show_min_stock_column: boolean;
//   updated_at: string;
// };

// function mapRow(row: ConfigurationRow): StockPageConfigurationDto {
//   return {
//     id: row.id,
//     showReferenceColumn: row.show_reference_column,
//     showLastModifiedColumn: row.show_last_modified_column,
//     showMinStockColumn: row.show_min_stock_column,
//     updatedAt: row.updated_at,
//   };
// }

// export const configurationService = {
//   async get(): Promise<StockPageConfigurationDto | null> {
//     const { data, error } = await supabase
//       .from("dashboard_settings")
//       .select("*")
//       .limit(1)
//       .maybeSingle();

//     if (error) {
//       throw new Error(error.message);
//     }

//     if (!data) return null;

//     return mapRow(data as ConfigurationRow);
//   },

//   async save(
//     payload: StockPageConfigurationDto
//   ): Promise<StockPageConfigurationDto> {
//     const current = await this.get();

//     if (!current?.id) {
//       const { data, error } = await supabase
//         .from("dashboard_settings")
//         .insert({
//           show_reference_column: payload.showReferenceColumn,
//           show_last_modified_column: payload.showLastModifiedColumn,
//           show_min_stock_column: payload.showMinStockColumn,
//           updated_at: new Date().toISOString(),
//         })
//         .select()
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }

//       return mapRow(data as ConfigurationRow);
//     }

//     const { data, error } = await supabase
//       .from("dashboard_settings")
//       .update({
//         show_reference_column: payload.showReferenceColumn,
//         show_last_modified_column: payload.showLastModifiedColumn,
//         show_min_stock_column: payload.showMinStockColumn,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", current.id)
//       .select()
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return mapRow(data as ConfigurationRow);
//   },
// };
