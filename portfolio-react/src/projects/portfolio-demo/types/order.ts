export type OrderStatus =
  | "Pending"
  | "Completed"
  | "Cancelled";

export interface Order {
  id: number;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
}