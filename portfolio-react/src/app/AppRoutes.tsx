import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ProjectsPage = lazy(() => import("../modules/portfolio/ProjectsPage"));
const PortfolioGalleryPage = lazy(
  () => import("../modules/portfolio/PortfolioGalleryPage")
);
const AppPortfolioDemo = lazy(
  () => import("../projects/portfolio-demo/AppPortfolioDemo")
);
const StockPage = lazy(
  () => import("../projects/stock-system/pages/stock/StockPage")
);
const AppApiUtilities = lazy(
  () => import("../projects/api-utilityes/AppApiUtilities")
);

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f7f6f3] px-6 text-[#4f4942]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#8e8377]" />
        Cargando
      </div>
    </div>
  );
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LazyRoute>
            <ProjectsPage />
          </LazyRoute>
        }
      />
      <Route
        path="/portfolio-demo/*"
        element={
          <LazyRoute>
            <AppPortfolioDemo />
          </LazyRoute>
        }
      />
      <Route
        path="/portfolio-gallery"
        element={
          <LazyRoute>
            <PortfolioGalleryPage />
          </LazyRoute>
        }
      />
      <Route
        path="/stock-system/*"
        element={
          <LazyRoute>
            <StockPage />
          </LazyRoute>
        }
      />
      <Route
        path="/api-utilities/*"
        element={
          <LazyRoute>
            <AppApiUtilities />
          </LazyRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
