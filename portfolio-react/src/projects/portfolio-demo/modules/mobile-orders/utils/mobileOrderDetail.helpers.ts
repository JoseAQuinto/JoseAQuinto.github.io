import type { MobileOrder, OrderStatus } from "../mobileOrders.types";

type MobileOrderDetailTranslations = {
  statusOptions: {
    pending: string;
    inProgress: string;
    completed: string;
  };
};

export function getStatusOptions(detailT: MobileOrderDetailTranslations): {
  value: OrderStatus;
  label: string;
}[] {
  return [
    { value: "Pending", label: detailT.statusOptions.pending },
    { value: "In Progress", label: detailT.statusOptions.inProgress },
    { value: "Completed", label: detailT.statusOptions.completed },
  ];
}

export function isOrderValid(order: MobileOrder | null): boolean {
  if (!order) return false;

  return (
    order.title.trim().length > 0 &&
    order.clientName.trim().length > 0 &&
    order.location.trim().length > 0 &&
    order.description.trim().length > 0
  );
}

export function toggleSetItem<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);

  if (next.has(item)) {
    next.delete(item);
  } else {
    next.add(item);
  }

  return next;
}