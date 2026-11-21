import {
  ArrowDownTrayIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, useState } from "react";
import { SectionLink } from "./SectionLink";
import type { CvLink } from "../portfolio.types";

export type NavItem = {
  id: string;
  label: string;
};

type PortfolioHeaderProps = {
  activeItem: string;
  brandName: string;
  copy: {
    label: string;
    menu: string;
    closeMenu: string;
    home: string;
  };
  cv: CvLink;
  cvShort: string;
  cvLabel: string;
  language: "es" | "en";
  languageAriaLabel: string;
  navItems: readonly NavItem[];
  onToggleLanguage: () => void;
};

export default function PortfolioHeader({
  activeItem,
  brandName,
  copy,
  cv,
  cvShort,
  cvLabel,
  language,
  languageAriaLabel,
  navItems,
  onToggleLanguage,
}: PortfolioHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape cierra el menú y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Si se pasa a escritorio con el menú abierto, se cierra.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const onChange = () => media.matches && setMenuOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="pf-header">
      <div className="pf-wrap pf-header__bar">
        <SectionLink to="hero" className="pf-brand" aria-label={`${brandName}. ${copy.home}`}>
          <span className="pf-brand__mark" aria-hidden="true">
            JQ
          </span>
          <span className="pf-brand__name">{brandName}</span>
        </SectionLink>

        <nav className="pf-nav" aria-label={copy.label}>
          {navItems.map((item) => (
            <SectionLink
              key={item.id}
              to={item.id}
              className="pf-nav__link"
              aria-current={activeItem === item.id ? "true" : undefined}
            >
              {item.label}
            </SectionLink>
          ))}
        </nav>

        <div className="pf-header__actions">
          <a
            href={cv.href}
            download={cv.fileName}
            aria-label={cv.ariaLabel}
            className="pf-btn pf-btn--primary pf-btn--small"
          >
            <ArrowDownTrayIcon aria-hidden="true" />
            <span className="pf-header__cv-short">{cvShort}</span>
            <span className="pf-header__cv-label">{cvLabel}</span>
          </a>

          <button
            type="button"
            className="pf-lang"
            onClick={onToggleLanguage}
            aria-label={languageAriaLabel}
          >
            <span className="pf-lang__option" data-active={language === "es"}>
              ES
            </span>
            <span className="pf-lang__option" data-active={language === "en"}>
              EN
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            className="pf-btn pf-btn--ghost pf-btn--small pf-menu-btn"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <XMarkIcon aria-hidden="true" />
            ) : (
              <Bars3Icon aria-hidden="true" />
            )}
            <span className="pf-menu-btn__label">
              {menuOpen ? copy.closeMenu : copy.menu}
            </span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        className="pf-mobile-nav"
        aria-label={copy.label}
        hidden={!menuOpen}
      >
        <ul className="pf-wrap">
          {navItems.map((item) => (
            <li key={item.id}>
              <SectionLink
                to={item.id}
                aria-current={activeItem === item.id ? "true" : undefined}
                onNavigate={() => setMenuOpen(false)}
              >
                {item.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
