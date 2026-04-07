import type { MobileOrder, SelectOption } from "./mobileOrders.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const clients: SelectOption[] = [
  { value: 1, label: "Acme Industries" },
  { value: 2, label: "Globex Corporation" },
  { value: 3, label: "Initech" },
  { value: 4, label: "Northwind Systems" },
];

let orders: MobileOrder[] = [
  {
    id: 1,
    code: "ORD-001",
    title: "Equipment inspection",
    clientId: 1,
    clientName: "Acme Industries",
    status: "Pending",
    date: "2026-04-01",
    location: "Warehouse A",
    description: "Routine inspection of production equipment and safety points.",
  },
  {
    id: 2,
    code: "ORD-002",
    title: "Maintenance task",
    clientId: 2,
    clientName: "Globex Corporation",
    status: "In Progress",
    date: "2026-04-03",
    location: "Plant 2",
    description: "Scheduled maintenance for conveyor system and main control panel.",
  },
  {
    id: 3,
    code: "ORD-003",
    title: "Quality check",
    clientId: 3,
    clientName: "Initech",
    status: "Completed",
    date: "2026-04-04",
    location: "Lab 1",
    description: "Final quality validation before shipment release.",
  },
  {
    id: 4,
    code: "ORD-004",
    title: "Packaging review",
    clientId: 1,
    clientName: "Acme Industries",
    status: "Pending",
    date: "2026-04-06",
    location: "Packaging Area",
    description: "Visual review of packaging standards and label placement.",
  },
  {
    id: 5,
    code: "ORD-005",
    title: "Stock adjustment",
    clientId: 4,
    clientName: "Northwind Systems",
    status: "In Progress",
    date: "2026-04-07",
    location: "Warehouse B",
    description: "Manual stock reconciliation for incoming materials.",
  },
];

export const mobileOrdersService = {
  async getOrders(): Promise<MobileOrder[]> {
    await delay(450);
    return [...orders];
  },

  async getClients(): Promise<SelectOption[]> {
    await delay(250);
    return [...clients];
  },

  async getOrderById(id: number): Promise<MobileOrder | null> {
    await delay(300);
    return orders.find((order) => order.id === id) ?? null;
  },

  async updateOrder(updatedOrder: MobileOrder): Promise<MobileOrder> {
    await delay(500);

    orders = orders.map((order) =>
      order.id === updatedOrder.id ? { ...updatedOrder } : order
    );

    return updatedOrder;
  },
};