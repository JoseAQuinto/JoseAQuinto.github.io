import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MobilePageShell from "./components/MobilePageShell";
import { mobileOrdersService } from "./mobileOrdersService";
import type { MobileOrder, OrderStatus } from "./mobileOrders.types";
import { useLanguage } from "../../../../translations/LanguageContext";

import {
  baseInputClass,
  STATUS_STYLES,
} from "./utils/mobileOrderDetail.constants";
import {
  getStatusOptions,
  isOrderValid,
  toggleSetItem,
} from "./utils/mobileOrderDetail.helpers";
import {
  BackIcon,
  ChevronIcon,
  ClipboardIcon,
  WarningIcon,
} from "./utils/mobileOrderDetail.icons";

type StatusOption = {
  value: OrderStatus;
  label: string;
};

export default function MobileOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const detailT = t.portfolioDemo.mobileOrderDetail;

  const statusOptions: StatusOption[] = useMemo(
    () => getStatusOptions(detailT),
    [detailT]
  );

  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["general"])
  );

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

    void loadOrder();
  }, [id]);

  const canSave = useMemo(() => {
    return isOrderValid(order);
  }, [order]);

  const updateField = <K extends keyof MobileOrder>(
    field: K,
    value: MobileOrder[K]
  ) => {
    setOrder((current) => {
      if (!current) return current;
      return { ...current, [field]: value };
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => toggleSetItem(prev, sectionId));
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

  const headerTitle = (
    <h1 className="flex-1 text-center text-sm font-bold text-slate-900">
      {isLoading || !order ? detailT.title : order.code}
    </h1>
  );

  if (isLoading) {
    return (
      <MobilePageShell
        fixedHeader
        header={
          <ShellHeader
            onBack={() => navigate(-1)}
            backLabel={t.common.back}
            centerContent={headerTitle}
          >
            <div className="w-[60px]" />
          </ShellHeader>
        }
      >
        <div className="space-y-3 px-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-slate-100 bg-white"
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
          <ShellHeader
            onBack={() => navigate(-1)}
            backLabel={t.common.back}
            centerContent={headerTitle}
          >
            <div className="w-[60px]" />
          </ShellHeader>
        }
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="flex justify-center">
            <ClipboardIcon className="h-8 w-8 text-slate-400" />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {detailT.notFound}
          </p>
        </div>
      </MobilePageShell>
    );
  }

  return (
    <MobilePageShell
      fixedHeader
      header={
        <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <BackButton label={t.common.back} onClick={() => navigate(-1)} />

            <button
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? detailT.saving : detailT.save}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-sm font-bold text-slate-900 sm:text-base">
              {order.code}
            </h1>
            <p className="text-xs text-slate-400">
              {detailT.editableSubtitle}
            </p>
          </div>

          {!canSave && order.title.trim().length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              <div className="flex items-center gap-2">
                <WarningIcon className="h-4 w-4 shrink-0" />
                <span>
                  {detailT.fields.title}{" "}
                  {detailT.requiredField ?? "es obligatorio"}
                </span>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-3 px-1 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <StatusBadge status={order.status} />
          <div className="grid flex-1 grid-cols-2 gap-3">
            <InfoCard label={detailT.fields.client} value={order.clientName} />
            <InfoCard label={detailT.fields.location} value={order.location} />
          </div>
        </div>

        <CollapsibleSection
          title={detailT.generalInformationTitle}
          subtitle={detailT.generalInformationSubtitle}
          isExpanded={expandedSections.has("general")}
          onToggle={() => toggleSection("general")}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={detailT.fields.orderCode}>
                <Input
                  value={order.code}
                  onChange={(v) => updateField("code", v)}
                />
              </Field>

              <Field label={detailT.fields.date}>
                <Input
                  type="date"
                  value={order.date}
                  onChange={(v) => updateField("date", v)}
                />
              </Field>
            </div>

            <Field label={detailT.fields.title}>
              <Input
                value={order.title}
                onChange={(v) => updateField("title", v)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={detailT.fields.client}>
                <Input
                  value={order.clientName}
                  onChange={(v) => updateField("clientName", v)}
                />
              </Field>

              <Field label={detailT.fields.location}>
                <Input
                  value={order.location}
                  onChange={(v) => updateField("location", v)}
                />
              </Field>
            </div>

            <Field label={detailT.fields.status}>
              <select
                value={order.status}
                onChange={(e) =>
                  updateField("status", e.target.value as OrderStatus)
                }
                className={baseInputClass}
              >
                {statusOptions.map((status: StatusOption) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={detailT.descriptionTitle}
          subtitle={detailT.descriptionSubtitle}
          isExpanded={expandedSections.has("description")}
          onToggle={() => toggleSection("description")}
        >
          <textarea
            value={order.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className={`${baseInputClass} resize-none leading-relaxed`}
            placeholder={
              detailT.descriptionPlaceholder ??
              "Describe los detalles de la orden..."
            }
          />
        </CollapsibleSection>

        {savedMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
            ✓ {savedMessage}
          </div>
        )}
      </div>
    </MobilePageShell>
  );
}

function ShellHeader({
  onBack,
  backLabel,
  centerContent,
  children,
}: {
  onBack: () => void;
  backLabel: string;
  centerContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <BackButton label={backLabel} onClick={onBack} />
        {centerContent}
        {children}
      </div>
    </div>
  );
}

function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 active:bg-slate-100"
      onClick={onClick}
    >
      <BackIcon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClass}
    />
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
          </div>

          <ChevronIcon
            className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-4 py-4">{children}</div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}