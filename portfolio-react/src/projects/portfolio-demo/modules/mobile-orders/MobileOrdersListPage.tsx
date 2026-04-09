import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobilePageShell from "./components/MobilePageShell";
import MobileList from "./components/MobileList";
import MobileSearchPicker from "./components/MobileSearchPicker";
import MobileBottomSheet from "./components/MobileBottomSheet";

import { mobileOrdersService } from "./mobileOrdersService";
import type { MobileOrder, SelectOption } from "./mobileOrders.types";
import { useLanguage } from "../../../../translations/LanguageContext";

export default function MobileOrdersListPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const listT = t.portfolioDemo.mobileOrdersList;

  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);

  const [selectedClientId, setSelectedClientId] = useState<number | "">("");
  const [selectedClientLabel, setSelectedClientLabel] = useState<string>(listT.selectClient);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [ordersData, clientsData] = await Promise.all([
          mobileOrdersService.getOrders(),
          mobileOrdersService.getClients(),
        ]);

        setOrders(ordersData);
        setClients(clientsData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedClientId === "") {
      setSelectedClientLabel(listT.selectClient);
    }
  }, [selectedClientId, listT.selectClient]);

  const filteredOrders = useMemo(() => {
    if (selectedClientId === "") return orders;
    return orders.filter((order) => order.clientId === selectedClientId);
  }, [orders, selectedClientId]);

  const listItems = useMemo(() => {
    return filteredOrders.map((order) => ({
      id: order.id,
      title: order.code,
      status: order.status,
      description: order.title,
      date: order.date,
      client: order.clientName,
      location: order.location,
    }));
  }, [filteredOrders]);

  const clearFilters = () => {
    setSelectedClientId("");
    setSelectedClientLabel(listT.selectClient);
  };

  return (
    <>
      <MobilePageShell
        fixedHeader
        title={listT.title}
        header={
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">{listT.title}</h1>
              <p className="mt-0.5 text-xs text-slate-400">{listT.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {selectedClientId !== "" && (
                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {listT.clear}
                </button>
              )}

              <button
                onClick={() => setShowFilter(true)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                {listT.filters}
              </button>
            </div>
          </div>
        }
      >
        <div className="mb-3 px-1">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {listT.activeClientFilter}
              </span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                {selectedClientLabel}
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 px-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-[1.25rem] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : (
          <MobileList items={listItems} onItemClick={(item) => navigate(`./${item.id}`)} />
        )}

        {showFilter && (
          <MobileBottomSheet
            open
            title={listT.filterSheetTitle}
            submitLabel={listT.close}
            onClose={() => setShowFilter(false)}
            onFinish={() => setShowFilter(false)}
            hideCancel
          >
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {listT.client}
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowClientPicker(true);
                    setShowFilter(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  {selectedClientLabel}
                </button>
              </div>
            </div>
          </MobileBottomSheet>
        )}

        {showClientPicker && (
          <MobileSearchPicker
            text={listT.selectClient}
            compactMode
            items={clients.map((client) => ({
              id: client.value,
              alias: client.label,
              descripcion: client.label,
              filterParam: client.label,
            }))}
            onItemClick={(id, alias) => {
              setSelectedClientId(id);
              setSelectedClientLabel(alias);
              setShowClientPicker(false);
            }}
            onClose={() => setShowClientPicker(false)}
          />
        )}
      </MobilePageShell>
    </>
  );
}