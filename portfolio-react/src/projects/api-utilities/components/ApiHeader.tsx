import { Link } from "react-router-dom";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

const editorialFont = "'Georgia', 'Times New Roman', serif";

export default function ApiHeader() {
  const { t } = useApiUtilitiesLanguage();

  return (
    <header className="mb-10 flex flex-col gap-6 rounded-[30px] border border-[#e5dfd6] bg-white/88 px-6 py-7 backdrop-blur-sm transition-[box-shadow,border-color,background-color] duration-500 hover:border-[#cfc6ba] hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-4 flex items-center gap-4">
          <div className="h-px w-10 bg-[#d8d0c5]" />
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[#9b948a]"
            style={{ fontFamily: editorialFont }}
          >
            {t.apiUtilitiesLabel}
          </span>
        </div>

        <h1
          className="text-[2.2rem] font-normal leading-[1.1] tracking-[-0.02em] text-[#171717] sm:text-[2.6rem]"
          style={{ fontFamily: editorialFont }}
        >
          {t.apiDocumentationTitle}
        </h1>

        <p
          className="mt-4 max-w-3xl text-sm leading-[1.95] text-[#6d655f]"
          style={{ fontFamily: editorialFont }}
        >
          {t.apiDocumentationDescription}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#cfc5b9] bg-[#f9f7f4] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#302c28] transition-all duration-300 hover:border-[#c3b9ad] hover:bg-[#f3eee7] hover:text-[#2a2622] hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)]"
          style={{ fontFamily: editorialFont }}
        >
          <span>{t.backToPortfolio}</span>
          <span>→</span>
        </Link>
      </div>
    </header>
  );
}