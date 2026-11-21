import {
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, type ReactNode } from "react";
import { useLanguage } from "../../translations/LanguageContext";
import ContactSection from "./components/ContactSection";
import FeaturedProject from "./components/FeaturedProject";
import PortfolioGalleryTeaser from "./components/PortfolioGalleryTeaser";
import PortfolioHeader, { type NavItem } from "./components/PortfolioHeader";
import ProjectCard from "./components/ProjectCard";
import { SectionLink } from "./components/SectionLink";
import SystemMap from "./components/SystemMap";
import { CONTACT, CV_FILE_NAME, CV_HREF } from "./contact";
import { useActiveSection } from "./hooks/useActiveSection";
import type { CvLink, PortfolioProject } from "./portfolio.types";
import { scrollToSection } from "./sectionNav";
import "@fontsource-variable/archivo/wdth.css";
import "./portfolio.css";

/**
 * Evita que una palabra con guion ("full-stack") se parta en dos líneas en
 * titulares grandes.
 */
function keepHyphenatedWords(text: string): ReactNode[] {
  return text.split(/(\S+-\S+)/).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="pf-nowrap">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Secciones de primer nivel que sigue el indicador de la navegación.
const SECTION_IDS = [
  "hero",
  "work",
  "about",
  "stack",
  "portfolio-websites",
  "contact",
] as const;

export default function ProjectsPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const activeSection = useActiveSection(SECTION_IDS);
  const page = t.projectsPage;

  const cv: CvLink = {
    href: CV_HREF,
    fileName: CV_FILE_NAME,
    ariaLabel: page.cv.ariaLabel,
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // El antiguo estilo "Tecno" se eliminó: se limpia cualquier resto que una
  // visita anterior hubiera dejado guardado.
  useEffect(() => {
    document.body.classList.remove("portfolio-techno-active");
    try {
      localStorage.removeItem("portfolio-visual-style");
    } catch {
      /* almacenamiento no disponible: nada que limpiar */
    }
  }, []);

  const navItems = useMemo<NavItem[]>(
    () => [
      { id: "work", label: page.nav.work },
      { id: "about", label: page.nav.experience },
      { id: "stack", label: page.nav.stack },
      { id: "portfolio-websites", label: page.nav.websites },
      { id: "contact", label: page.nav.contact },
    ],
    [page.nav]
  );

  const [currentRole, internship] = page.about.roles;

  return (
    <div className="pf">
      <a className="pf-skip" href="#main-content" onClick={(event) => {
        event.preventDefault();
        scrollToSection("main-content");
      }}>
        {page.skipToContent}
      </a>

      <PortfolioHeader
        activeItem={activeSection}
        brandName="Jose Ángel Quinto"
        copy={page.nav}
        cv={cv}
        cvLabel={page.cv.label}
        cvShort={page.cv.short}
        language={language}
        languageAriaLabel={page.language.ariaLabel}
        navItems={navItems}
        onToggleLanguage={toggleLanguage}
      />

      <main id="main-content" tabIndex={-1}>
        {/* ---------------------------------------------------------- */}
        <section id="hero" className="pf-hero" aria-labelledby="hero-title">
          <div className="pf-wrap pf-hero__grid">
            <div className="pf-hero__intro">
              <p className="pf-hero__who">
                <span className="pf-hero__name">{page.hero.name}</span>
                <span className="pf-hero__role">{page.hero.role}</span>
              </p>

              <h1 id="hero-title" className="pf-display pf-h1">
                {keepHyphenatedWords(page.hero.title)}
              </h1>

              <p className="pf-lead pf-hero__summary">{page.hero.summary}</p>

              <div className="pf-hero__actions">
                <SectionLink to="work" className="pf-btn pf-btn--primary">
                  {page.hero.primaryCta}
                </SectionLink>
                <a
                  href={cv.href}
                  download={cv.fileName}
                  aria-label={cv.ariaLabel}
                  className="pf-btn pf-btn--ghost"
                >
                  <ArrowDownTrayIcon aria-hidden="true" />
                  {page.cv.label}
                  <span className="pf-hero__cv-note">{page.cv.note}</span>
                </a>
                <SectionLink to="contact" className="pf-link">
                  {page.hero.contactCta}
                </SectionLink>
              </div>

              <dl className="pf-facts">
                {page.hero.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="pf-label">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="pf-hero__map">
              <SystemMap copy={page.systemMap} />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        <section id="work" className="pf-section" aria-labelledby="work-title">
          <div className="pf-wrap">
            <div className="pf-section-head">
              <div>
                <span className="pf-aisle" aria-hidden="true" />
                <h2 id="work-title" className="pf-display pf-h2">
                  {page.work.title}
                </h2>
              </div>
              <p className="pf-body">{page.work.intro}</p>
            </div>

            <FeaturedProject
              id="featured-project"
              project={page.featuredProject}
              featuredLabel={page.featuredLabel}
              techLabel={page.techLabel}
              pointsLabel={page.pointsLabel}
            />
            <FeaturedProject
              id="featured-project-dimension"
              project={page.featuredProjectDimension}
              featuredLabel={page.featuredLabel}
              techLabel={page.techLabel}
              pointsLabel={page.pointsLabel}
              layout="wide"
            />

            <div id="projects" className="pf-subhead">
              <h3 className="pf-h3">{page.demos.title}</h3>
              <p className="pf-body pf-small">{page.demos.intro}</p>
            </div>
            <ul className="pf-rows">
              {(page.projects as readonly PortfolioProject[]).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  techLabel={page.techLabel}
                />
              ))}
            </ul>

            <div id="operational-projects" className="pf-subhead">
              <h3 className="pf-h3">{page.apps.title}</h3>
              <p className="pf-body pf-small">{page.apps.intro}</p>
            </div>
            <ul className="pf-apps">
              {page.operationalProjects.map((project) => (
                <li key={project.id} className="pf-app">
                  <div className="pf-app__top">
                    <h4 className="pf-row__title">{project.title}</h4>
                    <span className="pf-status">{page.apps.onlineLabel}</span>
                  </div>
                  <p className="pf-app__desc">{project.description}</p>
                  <ul className="pf-tags" aria-label={page.techLabel}>
                    {project.tags.map((tag) => (
                      <li key={tag} className="pf-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="pf-app__actions">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pf-link"
                    >
                      {page.apps.openCta}
                      <span className="pf-sr-only">: {project.title}</span>
                      <ArrowUpRightIcon aria-hidden="true" />
                    </a>
                    {"codeHref" in project && (
                      <a
                        href={project.codeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-link"
                      >
                        {page.apps.codeCta}
                        <span className="pf-sr-only">: {project.title}</span>
                        <ArrowUpRightIcon aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        <section
          id="about"
          className="pf-section pf-about"
          aria-labelledby="about-title"
        >
          <div className="pf-wrap">
            <div className="pf-section-head">
              <div>
                <span className="pf-aisle" aria-hidden="true" />
                <h2 id="about-title" className="pf-display pf-h2">
                  {page.about.title}
                </h2>
              </div>
              <p className="pf-body">{page.about.intro}</p>
            </div>

            <div className="pf-xp">
              <ol className="pf-xp__timeline">
                {[currentRole, internship].map((role) => (
                  <li key={role.period} className="pf-role">
                    <p className="pf-role__period">{role.period}</p>
                    <div>
                      <h3 className="pf-h3">{role.title}</h3>
                      <p className="pf-role__org">{role.org}</p>
                      {role.areas.length > 0 && (
                        <ul className="pf-areas">
                          {role.areas.map((area) => (
                            <li key={area.name} className="pf-area">
                              <h4 className="pf-area__name">{area.name}</h4>
                              <p className="pf-area__text">{area.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <aside className="pf-xp__side">
                <div className="pf-side-block">
                  <h3>{page.about.educationTitle}</h3>
                  <ul className="pf-side-list">
                    {page.about.education.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pf-side-block">
                  <h3>{page.about.languagesTitle}</h3>
                  <ul className="pf-side-list">
                    {page.about.languages.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        <section id="stack" className="pf-section" aria-labelledby="stack-title">
          <div className="pf-wrap">
            <div className="pf-section-head">
              <div>
                <span className="pf-aisle" aria-hidden="true" />
                <h2 id="stack-title" className="pf-display pf-h2">
                  {page.stack.title}
                </h2>
              </div>
              <p className="pf-body">{page.stack.intro}</p>
            </div>

            <ul className="pf-stack">
              {page.stack.groups.map((group) => (
                <li key={group.name} className="pf-stack__group">
                  <h3 className="pf-stack__name">{group.name}</h3>
                  <ul className="pf-tags">
                    {group.core.map((tech) => (
                      <li key={tech} className="pf-tag pf-tag--strong">
                        {tech}
                      </li>
                    ))}
                    {group.extra.map((tech) => (
                      <li key={tech} className="pf-tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <p className="pf-stack__use">{group.use}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PortfolioGalleryTeaser />

        <ContactSection copy={page.contact} cv={cv} />
      </main>

      <footer className="pf-footer">
        <div className="pf-wrap pf-footer__inner">
          <p>
            © {new Date().getFullYear()} {page.footer.rights}. {page.footer.built}
          </p>
          <div className="pf-footer__links">
            <a
              className="pf-link pf-link--on-deep"
              href={CONTACT.sourceRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.footer.source}
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className="pf-totop"
        data-visible={activeSection !== "hero"}
        aria-label={page.footer.backToTop}
        tabIndex={activeSection === "hero" ? -1 : 0}
        onClick={() => scrollToSection("hero")}
      >
        <ArrowUpIcon aria-hidden="true" />
      </button>
    </div>
  );
}
