import { domAnimation, LazyMotion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useLanguage } from "../../translations/LanguageContext";
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioGalleryTeaser from "./components/PortfolioGalleryTeaser";
import FeaturedProject from "./components/FeaturedProject";
import ProjectCard from "./components/ProjectCard";
import Reveal from "./components/Reveal";
import { useActiveSection } from "./hooks/useActiveSection";
import type { PortfolioProject } from "./portfolio.types";
import "./portfolio.css";

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/JoseAQuinto/JoseAQuinto.github.io",
    label: "GitHub",
  },
] as const;

const SECTION_IDS = [
  "hero",
  "featured-project",
  "about",
  "projects",
  "operational-projects",
  "portfolio-websites",
] as const;

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span className="h-px w-8 bg-[#978d82]" aria-hidden="true" />
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#716a63]">
        {children}
      </span>
    </div>
  );
}

export default function ProjectsPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const activeSection = useActiveSection(SECTION_IDS);
  const page = t.projectsPage;
  const common = t.common;

  // El estilo "Tecno style" queda desactivado: se limpia cualquier resto que
  // hubiera quedado guardado de una visita anterior.
  useEffect(() => {
    document.body.classList.remove("portfolio-techno-active");
    localStorage.removeItem("portfolio-visual-style");
  }, []);

  const navItems = useMemo(
    () => [
      { id: "featured-project", label: page.featuredNavLabel },
      { id: "about", label: page.aboutTitle },
      { id: "projects", label: page.projectsTitle },
      {
        id: "operational-projects",
        label: page.operationalProjectsNavLabel,
      },
      {
        id: "portfolio-websites",
        label: language === "es" ? "Portfolios web" : "Web portfolios",
      },
    ],
    [
      language,
      page.aboutTitle,
      page.featuredNavLabel,
      page.operationalProjectsNavLabel,
      page.projectsTitle,
    ]
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        className="portfolio-page min-h-screen overflow-x-hidden"
      >
        <a className="portfolio-skip-link" href="#main-content">
          {page.skipToContent}
        </a>

        <PortfolioHeader
          activeSection={activeSection}
          changeLanguageLabel={common.changeLanguageAriaLabel}
          language={language}
          navItems={navItems}
          onToggleLanguage={toggleLanguage}
        />

        <main id="main-content">
          <header
            id="hero"
            className="portfolio-hero relative flex min-h-[calc(100svh-65px)] scroll-mt-24 items-center border-b border-[#ddd7cf]"
          >
            <span
              className="portfolio-wordmark pointer-events-none absolute -bottom-4 -right-4 hidden text-[clamp(8rem,22vw,19rem)] leading-none tracking-[-0.07em] lg:block"
              aria-hidden="true"
            >
              JQ
            </span>

            <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:py-24">
              <div>
                <Reveal>
                  <div className="mb-9 flex flex-wrap items-center gap-4">
                    <span className="h-px w-8 bg-[#93897e]" />
                    <span className="text-[10px] uppercase tracking-[0.23em] text-[#6f6861]">
                      {page.badge}
                    </span>
                    <span className="relative ml-1 h-1.5 w-1.5 rounded-full bg-[#766b60] portfolio-status-dot" />
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <h1 className="max-w-4xl text-[clamp(3.25rem,9vw,7.4rem)] font-normal leading-[0.92] tracking-[-0.055em] text-[#171513]">
                    {page.title}
                  </h1>
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="mt-7 max-w-2xl text-[clamp(1.1rem,2vw,1.45rem)] leading-relaxed text-[#3e3934]">
                    {page.subtitle}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b645d]">
                    {page.intro}
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <a
                      href="#projects"
                      className="group inline-flex items-center gap-3 rounded-full bg-[#1d1a18] px-5 py-3 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#403a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-3 focus-visible:ring-offset-[#f7f6f3]"
                    >
                      {page.viewSelectedWork}
                      <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                        ↓
                      </span>
                    </a>

                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-social={link.label.toLowerCase()}
                        className="portfolio-social-link pb-1 text-[10px] uppercase tracking-[0.16em] text-[#706961] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.16} className="lg:pb-1">
                <aside className="rounded-[26px] border border-[#ded8d0] bg-white/65 p-6 shadow-[0_20px_70px_rgba(44,38,32,0.05)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6f7967]" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#948b82]">
                        {page.availabilityLabel}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#4e4842]">
                        {page.availabilityText}
                      </p>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#e2ddd6]" />

                  <dl className="grid grid-cols-2 gap-5">
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-[#9a9289]">
                        {page.experienceLabel}
                      </dt>
                      <dd className="mt-2 text-2xl text-[#211e1b]">1+</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-[#9a9289]">
                        {page.selectedProjectsLabel}
                      </dt>
                      <dd className="mt-2 text-2xl text-[#211e1b]">
                        {String(
                          1 +
                            page.projects.length +
                            page.operationalProjects.length
                        ).padStart(2, "0")}
                      </dd>
                    </div>
                  </dl>
                </aside>
              </Reveal>
            </div>
          </header>

          <FeaturedProject />

          <section
            id="about"
            className="portfolio-section-lazy relative scroll-mt-20 overflow-hidden bg-white py-24 sm:py-32"
          >
            <span
              className="portfolio-wordmark pointer-events-none absolute -right-5 top-8 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em]"
              aria-hidden="true"
            >
              02
            </span>

            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
              <Reveal>
                <div className="grid gap-8 border-b border-[#e5e0d9] pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                  <div>
                    <SectionEyebrow>{page.aboutTitle}</SectionEyebrow>
                    <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] leading-none tracking-[-0.035em] text-[#181614]">
                      {page.heroAsideTitle}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-[#655e57] lg:justify-self-end">
                    {page.aboutSectionNote}
                  </p>
                </div>
              </Reveal>

              <div className="mt-8 grid gap-px overflow-hidden rounded-[28px] border border-[#e2ddd6] bg-[#e2ddd6] md:grid-cols-2">
                {page.experience.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.05}>
                    <article className="h-full bg-[#fbfaf8] p-7 transition-colors duration-300 hover:bg-white sm:p-9">
                      <span className="text-[10px] tabular-nums tracking-[0.2em] text-[#aaa198]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-7 text-xl leading-snug text-[#211e1b]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#69625b]">
                        {item.description}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal className="mt-12">
                <p className="mb-4 text-[9px] uppercase tracking-[0.22em] text-[#928a81]">
                  {page.techStackTitle}
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {page.techStack.map((tech) => (
                    <li key={tech} className="text-xs text-[#554f49]">
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          <section
            id="projects"
            className="portfolio-section-lazy relative scroll-mt-20 overflow-hidden border-t border-[#e1dcd5] bg-[#f7f6f3] py-24 sm:py-32"
          >
            <span
              className="portfolio-wordmark pointer-events-none absolute -bottom-6 -left-6 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em]"
              aria-hidden="true"
            >
              03
            </span>

            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
              <Reveal>
                <div className="mb-14 grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                  <div>
                    <SectionEyebrow>{page.projectsEyebrow}</SectionEyebrow>
                    <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] leading-none tracking-[-0.035em] text-[#181614]">
                      {page.projectsTitle}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-[#655e57] lg:justify-self-end">
                    {page.projectsSubtitle}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-5">
                {(page.projects as readonly PortfolioProject[]).map(
                  (project, index) => (
                    <ProjectCard
                      key={project.id}
                      copy={page}
                      index={index}
                      project={project}
                    />
                  )
                )}
              </div>
            </div>
          </section>

          <section
            id="operational-projects"
            className="portfolio-section-lazy relative scroll-mt-20 overflow-hidden border-t border-[#37322e] bg-[#1d1a18] py-24 text-white sm:py-32"
          >
            <span
              className="pointer-events-none absolute -right-5 -top-5 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)]"
              aria-hidden="true"
            >
              04
            </span>

            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
              <Reveal>
                <div className="mb-14 grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                  <div>
                    <div className="mb-5 flex items-center gap-4">
                      <span className="h-px w-8 bg-[#9f968d]" aria-hidden="true" />
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#b8afa7]">
                        {page.operationalProjectsEyebrow}
                      </span>
                    </div>
                    <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] leading-none tracking-[-0.035em] text-white">
                      {page.operationalProjectsTitle}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-[#c5bdb5] lg:justify-self-end">
                    {page.operationalProjectsSubtitle}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-5 md:grid-cols-2">
                {page.operationalProjects.map((project, index) => (
                  <Reveal key={project.id} delay={index * 0.05}>
                    <article className="group flex h-full flex-col rounded-[28px] border border-white/12 bg-white/[0.055] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] sm:p-9">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] tabular-nums tracking-[0.2em] text-[#8e857d]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#65775e] bg-[#40503a]/35 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#c8d5c2]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#91a889]" aria-hidden="true" />
                          {page.operationalProjectsOnlineLabel}
                        </span>
                      </div>

                      <h3 className="mt-8 text-[clamp(1.9rem,4vw,3.1rem)] leading-none tracking-[-0.035em] text-white">
                        {project.title}
                      </h3>
                      <p className="mt-5 max-w-xl text-sm leading-7 text-[#c5bdb5]">
                        {project.description}
                      </p>

                      <ul className="mt-7 flex flex-wrap gap-2" aria-label={page.operationalProjectsTechLabel}>
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#a9a098]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-9 inline-flex w-fit items-center gap-3 border-b border-[#8f857c] pb-1 text-[10px] uppercase tracking-[0.17em] text-white transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8aea4]"
                      >
                        {page.operationalProjectsCta}
                        <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">
                          {"\u2197"}
                        </span>
                      </a>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <PortfolioGalleryTeaser />
        </main>

        <a
          href="#hero"
          aria-label={common.backToTop}
          className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#d3cbc1] bg-white/90 text-sm text-[#4f4841] shadow-[0_10px_30px_rgba(36,31,27,0.08)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#a99d90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] ${
            activeSection === "hero"
              ? "pointer-events-none translate-y-3 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          ↑
        </a>

        <footer className="border-t border-[#ddd7cf] bg-white py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-[10px] tracking-[0.14em] text-[#8f877f]">
              © {new Date().getFullYear()} {page.footer}
            </p>
            <div className="flex items-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social={link.label.toLowerCase()}
                  className="portfolio-social-link pb-1 text-[10px] uppercase tracking-[0.16em] text-[#8f877f] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}
