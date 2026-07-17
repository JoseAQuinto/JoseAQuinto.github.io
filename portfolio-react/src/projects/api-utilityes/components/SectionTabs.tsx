import type { ApiSection } from "../types/api";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

type Props = {
  activeSection: ApiSection;
  onChange: (section: ApiSection) => void;
};

export default function SectionTabs({ activeSection, onChange }: Props) {
  const { t } = useApiUtilitiesLanguage();

  return (
    <nav
      className="grid w-full grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 sm:w-auto"
      role="tablist"
      aria-label="API sections"
    >
      {([
        ["utilities", t.utilitiesTab],
        ["crud", t.crudTab],
      ] as const).map(([section, label]) => {
        const active = activeSection === section;
        return (
          <button
            key={section}
            type="button"
            onClick={() => onChange(section)}
            role="tab"
            aria-selected={active}
            className={`rounded-md px-4 py-2 text-xs font-semibold transition sm:min-w-40 ${
              active
                ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
