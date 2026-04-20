import type { StockPageConfigurationDto } from "../dto/configuration.dto";
import { hasSupabaseEnv, supabase } from "./supabaseClient";

let mockConfiguration: StockPageConfigurationDto = {
  id: 1,
  showReferenceColumn: true,
  showLastModifiedColumn: true,
  showMinStockColumn: true,
  updatedAt: new Date().toISOString(),
};

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