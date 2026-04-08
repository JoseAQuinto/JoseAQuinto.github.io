import { NavLink, Route, Routes } from "react-router-dom";

import OperationsOverviewPage from "./modules/operations-overview/OperationsOverviewPage";
import PerformanceAnalyticsPage from "./modules/performance-analytics/PerformanceAnalyticsPage";
import MobileOrdersListPage from "./modules/mobile-orders/MobileOrdersListPage";
import MobileOrderDetailPage from "./modules/mobile-orders/MobileOrderDetailPage";
import ProductionMonitoringPage from "./modules/production-monitoring/productionMonitoringPage";

export default function AppPortfolioDemo() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Portfolio Demo</h1>
            <p className="text-sm text-slate-500">Interactive front-end modules</p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/portfolio-demo"
              end
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Overview
            </NavLink>

            <NavLink
              to="/portfolio-demo/performance"
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Performance
            </NavLink>

            <NavLink
              to="/portfolio-demo/mobile-orders"
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Mobile Orders
            </NavLink>

            <NavLink
              to="/portfolio-demo/production-monitoring"
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Production Monitoring
            </NavLink>
          </nav>
        </div>
      </header>

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