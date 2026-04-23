import type { ApiSection } from "../types/api";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  activeSection: ApiSection;
  onChange: (section: ApiSection) => void;
};

export default function SectionTabs({
  activeSection,
  onChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onChange("utilities")}
        className={`rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
          activeSection === "utilities"
            ? "border-[#cfc6ba] bg-[#f3eee7] text-[#2a2622] shadow-[0_6px_18px_rgba(0,0,0,0.05)]"
            : "border-[#ddd5cb] bg-white text-[#7c756d] hover:border-[#c3b9ad] hover:bg-[#faf8f5] hover:text-[#2a2622]"
        }`}
        style={{ fontFamily: editorialFont }}
      >
        Utilities
      </button>

      <button
        type="button"
        onClick={() => onChange("crud")}
        className={`rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
          activeSection === "crud"
            ? "border-[#cfc6ba] bg-[#f3eee7] text-[#2a2622] shadow-[0_6px_18px_rgba(0,0,0,0.05)]"
            : "border-[#ddd5cb] bg-white text-[#7c756d] hover:border-[#c3b9ad] hover:bg-[#faf8f5] hover:text-[#2a2622]"
        }`}
        style={{ fontFamily: editorialFont }}
      >
        Supabase CRUD
      </button>
    </div>
  );
}