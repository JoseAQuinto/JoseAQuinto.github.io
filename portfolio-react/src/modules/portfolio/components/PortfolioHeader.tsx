type NavItem = {
  id: string;
  label: string;
};

type PortfolioHeaderProps = {
  activeSection: string;
  changeLanguageLabel: string;
  isTechnoStyle: boolean;
  language: "es" | "en";
  navItems: readonly NavItem[];
  onToggleLanguage: () => void;
  onToggleTechnoStyle: () => void;
};

export default function PortfolioHeader({
  activeSection,
  changeLanguageLabel,
  isTechnoStyle,
  language,
  navItems,
  onToggleLanguage,
  onToggleTechnoStyle,
}: PortfolioHeaderProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#ddd8d0]/90 bg-[#f7f6f3]/90 backdrop-blur-xl"
      aria-label={language === "es" ? "Navegación principal" : "Main navigation"}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#hero"
          className="rounded-sm text-xs uppercase tracking-[0.2em] text-[#24211e] transition-colors hover:text-[#6e655c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6f3] sm:text-sm"
        >
          José Ángel Quinto
        </a>

        <div className="flex items-center gap-2 sm:gap-5">
          <div className="hidden items-center gap-7 sm:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "location" : undefined}
                className="portfolio-nav-link rounded-sm pb-1 text-[11px] uppercase tracking-[0.16em] text-[#817970] transition-colors hover:text-[#201d1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6f3] data-[active=true]:text-[#201d1a]"
                data-active={activeSection === item.id}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTechnoStyle}
            aria-label={
              language === "es"
                ? "Alternar estilo tecnológico"
                : "Toggle techno style"
            }
            aria-pressed={isTechnoStyle}
            className="portfolio-theme-toggle"
          >
            <span className="portfolio-theme-toggle__signal" aria-hidden="true" />
            Tecno style
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={changeLanguageLabel}
            className="rounded-full border border-[#d8d1c8] bg-white/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#5e5750] transition hover:border-[#b9aea1] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f6f3]"
          >
            {language === "es" ? "ES" : "EN"}
          </button>
        </div>
      </div>
    </nav>
  );
}
