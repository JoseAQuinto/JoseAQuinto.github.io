import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MobilePageShell from "./components/MobilePageShell";
import { mobileOrdersService } from "./mobileOrdersService";
import type { MobileOrder, OrderStatus } from "./mobileOrders.types";
import { useLanguage } from "../../../../translations/LanguageContext";

export default function MobileOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const detailT = t.portfolioDemo.mobileOrderDetail;

  const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: "Pending", label: detailT.statusOptions.pending },
    { value: "In Progress", label: detailT.statusOptions.inProgress },
    { value: "Completed", label: detailT.statusOptions.completed },
  ];

  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["general"]));

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!order || !canSave) return;

    try {
      setIsSaving(true);
      setSavedMessage("");

      await mobileOrdersService.updateOrder(order);

      setSavedMessage(detailT.savedMessage);
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
          <div className="flex items-center justify-between gap-2 p-4">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
              onClick={() => navigate(-1)}
            >
              {t.common.back}
            </button>
            <h1 className="flex-1 text-center text-sm font-bold text-slate-900">{detailT.title}</h1>
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
          <div className="flex items-center justify-between gap-2 p-4">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
              onClick={() => navigate(-1)}
            >
              {t.common.back}
            </button>
            <h1 className="flex-1 text-center text-sm font-bold text-slate-900">{detailT.title}</h1>
            <div className="w-[52px]" />
          </div>
        }
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          {detailT.notFound}
        </div>
      </MobilePageShell>
    );
  }

  return (
    <MobilePageShell
      fixedHeader
      header={
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
              onClick={() => navigate(-1)}
            >
              {t.common.back}
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? detailT.saving : detailT.save}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-base font-bold text-slate-900">{order.code}</h1>
            <p className="text-xs text-slate-500">{detailT.editableSubtitle}</p>
          </div>

          {!canSave && order.title.trim().length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              ⚠️ {detailT.fields.title} {detailT.requiredField || "es obligatorio"}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-3 px-1">
        {/* Status Badge */}
        <div className="flex gap-2">
          <StatusBadge status={order.status} />
          <div className="flex-1" />
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard label={detailT.fields.client} value={order.clientName} />
          <InfoCard label={detailT.fields.location} value={order.location} />
        </div>

        {/* Collapsible Sections */}
        <CollapsibleSection
          id="general"
          title={detailT.generalInformationTitle}
          subtitle={detailT.generalInformationSubtitle}
          isExpanded={expandedSections.has("general")}
          onToggle={() => toggleSection("general")}
        >
          <div className="space-y-3">
            <Field label={detailT.fields.orderCode}>
              <input
                value={order.code}
                onChange={(e) => updateField("code", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label={detailT.fields.title}>
              <input
                value={order.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label={detailT.fields.client}>
              <input
                value={order.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label={detailT.fields.location}>
              <input
                value={order.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label={detailT.fields.date}>
              <input
                type="date"
                value={order.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field label={detailT.fields.status}>
              <select
                value={order.status}
                onChange={(e) => updateField("status", e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </CollapsibleSection>

        {/* Description Section */}
        <CollapsibleSection
          id="description"
          title={detailT.descriptionTitle}
          subtitle={detailT.descriptionSubtitle}
          isExpanded={expandedSections.has("description")}
          onToggle={() => toggleSection("description")}
        >
          <textarea
            value={order.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder={detailT.descriptionPlaceholder || "Describe los detalles de la orden..."}
          />
        </CollapsibleSection>

        {/* Success Message */}
        {savedMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm animate-in fade-in duration-300">
            ✓ {savedMessage}
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          </div>
          <div
            className={`mt-0.5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </div>
        </div>
      </button>

      {isExpanded && <div className="border-t border-slate-200 px-4 py-3">{children}</div>}
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <div className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900 line-clamp-2">{value || "—"}</p>
    </div>
  );
}