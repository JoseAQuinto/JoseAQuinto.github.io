import { lazy, Suspense, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  type NavLinkRenderProps,
} from "react-router-dom";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import PortfolioDemoIntroModal from "./components/PortfolioDemoIntroModal";
import { useLanguage } from "../../translations/LanguageContext";

const OperationsOverviewPage = lazy(
  () => import("./modules/operations-overview/OperationsOverviewPage")
);
const PerformanceAnalyticsPage = lazy(
  () => import("./modules/performance-analytics/PerformanceAnalyticsPage")
);
const MobileOrdersListPage = lazy(
  () => import("./modules/mobile-orders/MobileOrdersListPage")
);
const MobileOrderDetailPage = lazy(
  () => import("./modules/mobile-orders/MobileOrderDetailPage")
);
const ProductionMonitoringPage = lazy(
  () => import("./modules/production-monitoring/productionMonitoringPage")
);

const navLinkClass = ({ isActive }: NavLinkRenderProps): string =>
  `rounded-xl border px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
    isActive
      ? "border-zinc-300 bg-white text-zinc-900 shadow-sm"
      : "border-transparent bg-transparent text-zinc-700 hover:border-zinc-200 hover:bg-white hover:text-zinc-900"
  }`;

function ProjectPageFallback() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center" role="status">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-500" />
        Cargando módulo
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const common = t.common;
  const demo = t.portfolioDemo;

  const navLinks = [
    { to: "/portfolio-demo", label: demo.nav.overview, end: true },
    { to: "/portfolio-demo/performance", label: demo.nav.performance },
    { to: "/portfolio-demo/mobile-orders", label: demo.nav.mobileOrders },
    {
      to: "/portfolio-demo/production-monitoring",
      label: demo.nav.productionMonitoring,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">{common.back}</span>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-zinc-900 sm:text-lg">
              {demo.title}
            </h1>
            <p className="hidden truncate text-sm text-zinc-500 sm:block">
              {demo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={toggleLanguage}
            aria-label={common.language}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <GlobeAltIcon className="h-4 w-4" />
            <span>{language === "es" ? "ES" : "EN"}</span>
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
            aria-label={language === "es" ? "Alternar menú" : "Toggle menu"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm transition hover:bg-zinc-50 lg:hidden"
          >
            {menuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-zinc-100 bg-white px-4 pb-3 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }: NavLinkRenderProps): string =>
                  `rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-zinc-300 bg-zinc-50 text-zinc-900 shadow-sm"
                      : "border-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default function AppPortfolioDemo() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PortfolioDemoIntroModal />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <Suspense fallback={<ProjectPageFallback />}>
          <Routes>
            <Route index element={<OperationsOverviewPage />} />
            <Route path="performance" element={<PerformanceAnalyticsPage />} />
            <Route path="mobile-orders" element={<MobileOrdersListPage />} />
            <Route path="mobile-orders/:id" element={<MobileOrderDetailPage />} />
            <Route
              path="production-monitoring"
              element={<ProductionMonitoringPage />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
