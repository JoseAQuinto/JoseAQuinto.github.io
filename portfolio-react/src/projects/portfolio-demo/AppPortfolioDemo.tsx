import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

import OperationsOverviewPage from "./modules/operations-overview/OperationsOverviewPage";
import PerformanceAnalyticsPage from "./modules/performance-analytics/PerformanceAnalyticsPage";
import MobileOrdersListPage from "./modules/mobile-orders/MobileOrdersListPage";
import MobileOrderDetailPage from "./modules/mobile-orders/MobileOrderDetailPage";
import ProductionMonitoringPage from "./modules/production-monitoring/productionMonitoringPage";

import { useLanguage } from "../../translations/LanguageContext";

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  const common = t.common;
  const demo = t.portfolioDemo;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {common.back}
          </button>

          <div>
            <h1 className="text-lg font-bold text-zinc-900">{demo.title}</h1>
            <p className="text-sm text-zinc-500">{demo.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2">
            <NavLink
              to="/portfolio-demo"
              end
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {demo.nav.overview}
            </NavLink>

            <NavLink
              to="/portfolio-demo/performance"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {demo.nav.performance}
            </NavLink>

            <NavLink
              to="/portfolio-demo/mobile-orders"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {demo.nav.mobileOrders}
            </NavLink>

            <NavLink
              to="/portfolio-demo/production-monitoring"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`
              }
            >
              {demo.nav.productionMonitoring}
            </NavLink>
          </nav>

          <button
            onClick={toggleLanguage}
            aria-label={common.language}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <GlobeAltIcon className="h-4 w-4" />
            {language === "es" ? "ES" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AppPortfolioDemo() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Routes>
          <Route index element={<OperationsOverviewPage />} />
          <Route path="performance" element={<PerformanceAnalyticsPage />} />
          <Route path="mobile-orders" element={<MobileOrdersListPage />} />
          <Route path="mobile-orders/:id" element={<MobileOrderDetailPage />} />
          <Route path="production-monitoring" element={<ProductionMonitoringPage />} />
        </Routes>
      </main>
    </div>
  );
}