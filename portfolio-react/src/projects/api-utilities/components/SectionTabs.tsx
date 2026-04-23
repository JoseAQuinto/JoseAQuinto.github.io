import type { ApiSection } from "../types/api";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  activeSection: ApiSection;
  onChange: (section: ApiSection) => void;
};

export default function SectionTabs({ activeSection, onChange }: Props) {
  const { t } = useApiUtilitiesLanguage();

  function getTabClasses(isActive: boolean) {
    return [
      "group relative flex-1 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9b99a]/45",
      isActive
        ? "bg-white text-[#1f1b17] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-[#e7dfd4]"
        : "text-[#746e66] hover:bg-white/70 hover:text-[#3f3a34]",
    ].join(" ");
  }

  function getIconClasses(isActive: boolean) {
    return isActive
      ? "h-4 w-4 text-[#bfa989]"
      : "h-4 w-4 text-[#b8b0a5] transition-colors duration-200 group-hover:text-[#9f917d]";
  }

  return (
    <div className="mb-8">
      <nav
        className="relative flex items-center gap-1 rounded-2xl border border-[#e8e2d9] bg-[#f8f6f2] p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        role="tablist"
        aria-label="Secciones de contenido"
      >
        <button
          type="button"
          onClick={() => onChange("utilities")}
          role="tab"
          aria-selected={activeSection === "utilities"}
          className={getTabClasses(activeSection === "utilities")}
          style={{ fontFamily: editorialFont }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className={getIconClasses(activeSection === "utilities")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {t.utilitiesTab}
          </span>

          <span
            className={[
              "absolute inset-x-4 rounded-full bg-gradient-to-r from-[#ccb999] to-[#a89277] transition-all duration-300",
              activeSection === "utilities"
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-35",
            ].join(" ")}
          />
        </button>


        <button
          type="button"
          onClick={() => onChange("crud")}
          role="tab"
          aria-selected={activeSection === "crud"}
          className={getTabClasses(activeSection === "crud")}
          style={{ fontFamily: editorialFont }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className={getIconClasses(activeSection === "crud")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {t.crudTab}
          </span>

          <span
            className={[
              "absolute inset-x-4 rounded-full bg-gradient-to-r from-[#ccb999] to-[#a89277] transition-all duration-300",
              activeSection === "crud"
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-35",
            ].join(" ")}
          />
        </button>
      </nav>
    </div>
  );
}