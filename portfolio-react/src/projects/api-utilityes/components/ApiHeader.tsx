import { Link } from "react-router-dom";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

export default function ApiHeader() {
  const { language, t, toggleLanguage } = useApiUtilitiesLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label={t.backToPortfolio}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            ←
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                API Utilities
              </h1>
              <span className="hidden rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200 sm:inline-flex">
                Developer tools
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              {t.apiDocumentationTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 text-xs text-slate-300 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Interactive docs
          </span>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
            className="h-9 rounded-lg border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
          >
            {language.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}
