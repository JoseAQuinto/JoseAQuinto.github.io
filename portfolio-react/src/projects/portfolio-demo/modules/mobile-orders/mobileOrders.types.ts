export type OrderStatus = "Pending" | "In Progress" | "Completed";

export interface MobileOrder {
  id: number;
  code: string;
  title: string;
  clientId: number;
  clientName: string;
  status: OrderStatus;
  date: string;
 location: string;
  description: string;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface MobileListItem {
  id: number;
  title: string;
  status?: string;
  description?: string;
  date?: string;
  client?: string;
  location?: string;
}