import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobilePageShell from "./components/MobilePageShell";
import MobileList from "./components/MobileList";

import { mobileOrdersService } from "./mobileOrdersService";
import type { MobileOrder } from "./mobileOrders.types";
import { useLanguage } from "../../../../translations/LanguageContext";
import FloatingInfoButton from "../../components/FloatingInfoButton";

export default function MobileOrdersListPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const listT = t.portfolioDemo.mobileOrdersList;

  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const ordersData = await mobileOrdersService.getOrders();
        setOrders(ordersData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!hideCompleted) return orders;
    return orders.filter((order) => order.status !== "Completed");
  }, [orders, hideCompleted]);

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

  const completedCount = useMemo(
    () => orders.filter((o) => o.status === "Completed").length,
    [orders]
  );

  return (
    <>
      <FloatingInfoButton
        position="bottom-right"
        title={listT.infoModal.title}
        subtitle={listT.infoModal.subtitle}
        paragraphs={[
          listT.infoModal.description1,
          listT.infoModal.description2,
          listT.infoModal.description3,
        ]}
        buttonLabel={listT.infoModal.confirm}
      />

      <MobilePageShell
        fixedHeader
        title={listT.title}
        header={
          <div className="flex flex-col items-stretch gap-3 px-3 py-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between sm:px-4">
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">{listT.title}</h1>
              <p className="mt-0.5 text-xs text-slate-400">{listT.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => setHideCompleted((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
            >
              <span
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ${hideCompleted ? "bg-indigo-500" : "bg-slate-200"
                  }`}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ${hideCompleted ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                />
              </span>
              <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                {listT.hideCompleted}
                {completedCount > 0 && (
                  <span className="ml-1 text-slate-400">({completedCount})</span>
                )}
              </span>
            </button>
          </div>
        }
      >
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
      </MobilePageShell>
    </>
  );
}