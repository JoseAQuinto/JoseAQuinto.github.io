import { simulateRequest } from "../apiClient";
import type { Order } from "../../types/order";

export async function getOrders(): Promise<Order[]> {
  const data: Order[] = [
    {
      id: 1,
      customerName: "John Doe",
      status: "Pending",
      createdAt: new Date().toISOString(),
      totalAmount: 125.5,
    },
    {
      id: 2,
      customerName: "Jane Smith",
      status: "Completed",
      createdAt: new Date().toISOString(),
      totalAmount: 89.9,
    },
  ];

  return simulateRequest(data);
}