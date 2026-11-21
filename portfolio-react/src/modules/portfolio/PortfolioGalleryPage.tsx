import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";
import {
  PORTFOLIO_GALLERY_COPY,
  PORTFOLIO_SHOWCASES,
} from "./portfolioGallery.data";
import { scrollToSection } from "./sectionNav";
import "@fontsource-variable/archivo/wdth.css";
import "./portfolio.css";

const SHOWCASE_TOTAL = PORTFOLIO_SHOWCASES.length;

export default function PortfolioGalleryPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const copy = PORTFOLIO_GALLERY_COPY[language];
  const page = t.projectsPage;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="pf">
      <header className="pf-header">
        <div className="pf-wrap pf-header__bar">
          <Link to="/" className="pf-brand">
            <span className="pf-brand__mark" aria-hidden="true">
              JQ
            </span>
            <span className="pf-brand__name">Jose Ángel Quinto</span>
          </Link>

          <nav
            className="pf-header__actions"
            aria-label={language === "es" ? "Navegación de la galería" : "Gallery navigation"}
          >
            <Link to="/" className="pf-btn pf-btn--ghost pf-btn--small">
              <ArrowLeftIcon aria-hidden="true" />
              {copy.back}
            </Link>
            <button
              type="button"
              className="pf-lang"
              onClick={toggleLanguage}
              aria-label={page.language.ariaLabel}
            >
              <span className="pf-lang__option" data-active={language === "es"}>
                ES
              </span>
              <span className="pf-lang__option" data-active={language === "en"}>
                EN
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="gallery-top"
          className="pf-gallery-hero"
          aria-labelledby="gallery-title"
        >
          <div className="pf-wrap pf-gallery-hero__grid">
            <div className="pf-gallery-hero__text">
              <span className="pf-aisle" aria-hidden="true" />
              <h1 id="gallery-title" className="pf-display pf-h1">
                {copy.title}
              </h1>
              <p className="pf-lead pf-gallery-hero__intro">
                {copy.intro}
              </p>
            </div>

            <nav className="pf-gallery-hero__index" aria-label={copy.index}>
              <p className="pf-label pf-websites__count">{copy.index}</p>
              <ol className="pf-gallery-index">
                {PORTFOLIO_SHOWCASES.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(project.id)}
                    >
                      <strong>{project.title}</strong>
                      <span>{project.category[language]}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        <div>
          {PORTFOLIO_SHOWCASES.map((project, index) => (
            <section
              id={project.id}
              key={project.id}
              className="pf-showcase"
              aria-labelledby={`${project.id}-title`}
            >
              <div className="pf-wrap">
                <div className="pf-showcase__head">
                  <div>
                    <p className="pf-label pf-showcase__count">
                      {index + 1} / {SHOWCASE_TOTAL}. {project.category[language]}
                    </p>
                    <h2 id={`${project.id}-title`} className="pf-display pf-h2">
                      {project.title}
                    </h2>
                  </div>
                  <div>
                    <p className="pf-body">{project.description[language]}</p>
                    <div className="pf-showcase__actions">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-btn pf-btn--primary pf-btn--small"
                      >
                        {copy.open}
                        <span className="pf-sr-only">: {project.title}</span>
                        <ArrowUpRightIcon aria-hidden="true" />
                      </a>
                      <span className="pf-status">{copy.live}</span>
                    </div>
                  </div>
                </div>

                <div className="pf-browser">
                  <div className="pf-browser__bar">
                    <span className="pf-browser__dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="pf-browser__domain">{project.domain}</span>
                    <span className="pf-browser__hint">{copy.preview}</span>
                  </div>
                  {project.previewImage ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pf-browser__static"
                      aria-label={`${copy.open}: ${project.title}`}
                    >
                      <img
                        src={project.previewImage}
                        alt={`Preview: ${project.title}`}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <iframe
                      src={project.url}
                      title={`${copy.preview}: ${project.title}`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="pf-footer">
        <div className="pf-wrap pf-footer__inner">
          <p>
            © {new Date().getFullYear()}. {copy.footer}
          </p>
          <div className="pf-footer__links">
            <Link to="/" className="pf-link pf-link--on-deep">
              <ArrowLeftIcon aria-hidden="true" />
              {copy.back}
            </Link>
            <button
              type="button"
              className="pf-link pf-link--on-deep pf-link--button"
              onClick={() => scrollToSection("gallery-top")}
            >
              {copy.backToTop}
              <ArrowUpIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
