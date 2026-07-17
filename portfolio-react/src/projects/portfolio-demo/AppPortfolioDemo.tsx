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
  Bars3Icon,
  GlobeAltIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../../translations/LanguageContext";
import PortfolioDemoIntroModal from "./components/PortfolioDemoIntroModal";

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

const navLinkClass = ({ isActive }: NavLinkRenderProps) =>
  `rounded-lg px-3 py-2 text-xs font-semibold transition whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
    isActive
      ? "bg-white text-slate-950 shadow-sm"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

function ProjectPageFallback() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-slate-50" role="status">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
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
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate("/")}
            type="button"
            aria-label={common.back}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold sm:text-base">{demo.title}</h1>
              <span className="hidden rounded border border-indigo-400/30 bg-indigo-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200 sm:inline-flex">
                Operations suite
              </span>
            </div>
            <p className="hidden truncate text-xs text-slate-400 sm:block">{demo.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Demo modules">
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
            className="flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
          >
            <GlobeAltIcon className="h-4 w-4" />
            {language === "es" ? "ES" : "EN"}
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
            aria-label={language === "es" ? "Alternar menú" : "Toggle menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 xl:hidden"
          >
            {menuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-slate-800 bg-slate-900 p-3 xl:hidden" aria-label="Demo modules mobile">
          <div className="mx-auto grid max-w-[1600px] gap-1 sm:grid-cols-2">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default function AppPortfolioDemo() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PortfolioDemoIntroModal />
      <Header />
      <main className="min-w-0">
        <Suspense fallback={<ProjectPageFallback />}>
          <Routes>
            <Route index element={<OperationsOverviewPage />} />
            <Route path="performance" element={<PerformanceAnalyticsPage />} />
            <Route path="mobile-orders" element={<MobileOrdersListPage />} />
            <Route path="mobile-orders/:id" element={<MobileOrderDetailPage />} />
            <Route path="production-monitoring" element={<ProductionMonitoringPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
