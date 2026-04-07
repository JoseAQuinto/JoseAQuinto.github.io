import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MobilePageShell from "./components/MobilePageShell";
import { mobileOrdersService } from "./mobileOrdersService";
import type { MobileOrder, OrderStatus } from "./mobileOrders.types";

const STATUS_OPTIONS: OrderStatus[] = ["Pending", "In Progress", "Completed"];

export default function MobileOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setIsLoading(true);

        const orderId = Number(id);
        if (!Number.isFinite(orderId)) {
          setOrder(null);
          return;
        }

        const data = await mobileOrdersService.getOrderById(orderId);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const canSave = useMemo(() => {
    if (!order) return false;

    return (
      order.title.trim().length > 0 &&
      order.clientName.trim().length > 0 &&
      order.location.trim().length > 0 &&
      order.description.trim().length > 0
    );
  }, [order]);

  const updateField = <K extends keyof MobileOrder>(field: K, value: MobileOrder[K]) => {
    setOrder((current) => {
      if (!current) return current;
      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSave = async () => {
    if (!order || !canSave) return;

    try {
      setIsSaving(true);
      setSavedMessage("");

      await mobileOrdersService.updateOrder(order);

      setSavedMessage("Changes saved in mock data");
      setTimeout(() => setSavedMessage(""), 1800);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MobilePageShell
        fixedHeader
        header={
          <div className="flex items-center justify-between p-4">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <h1 className="text-sm font-bold text-slate-900">Order detail</h1>
            <div className="w-[52px]" />
          </div>
        }
      >
        <div className="space-y-3 px-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </MobilePageShell>
    );
  }

  if (!order) {
    return (
      <MobilePageShell
        fixedHeader
        header={
          <div className="flex items-center justify-between p-4">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <h1 className="text-sm font-bold text-slate-900">Order detail</h1>
            <div className="w-[52px]" />
          </div>
        }
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          Order not found
        </div>
      </MobilePageShell>
    );
  }

  return (
    <MobilePageShell
      fixedHeader
      header={
        <div className="flex items-center justify-between p-4">
          <button
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <div className="text-center">
            <h1 className="text-sm font-bold text-slate-900">{order.code}</h1>
            <p className="text-[11px] text-slate-400">Editable mobile detail</p>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <div className="space-y-3 px-1">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-900">General information</h2>
            <p className="mt-0.5 text-xs text-slate-400">Basic editable fields</p>
          </div>

          <div className="space-y-3">
            <Field label="Order code">
              <input
                value={order.code}
                onChange={(e) => updateField("code", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Title">
              <input
                value={order.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Client">
              <input
                value={order.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Location">
              <input
                value={order.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={order.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Status">
              <select
                value={order.status}
                onChange={(e) => updateField("status", e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-900">Description</h2>
            <p className="mt-0.5 text-xs text-slate-400">Longer editable content</p>
          </div>

          <textarea
            value={order.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </section>

        {savedMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
            {savedMessage}
          </div>
        )}
      </div>
    </MobilePageShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}