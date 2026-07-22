import { domAnimation, LazyMotion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";
import Reveal from "./components/Reveal";
import {
  PORTFOLIO_GALLERY_COPY,
  PORTFOLIO_SHOWCASES,
} from "./portfolioGallery.data";
import "./portfolio.css";

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export default function PortfolioGalleryPage() {
  const { language, toggleLanguage } = useLanguage();
  const copy = PORTFOLIO_GALLERY_COPY[language];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="portfolio-page portfolio-gallery-page min-h-screen overflow-x-hidden">
        <nav
          className="sticky top-0 z-50 border-b border-[#d9d2c9]/90 bg-[#f3f0ea]/90 backdrop-blur-xl"
          aria-label={language === "es" ? "Navegación de la galería" : "Gallery navigation"}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.2em] text-[#24211e] transition-colors hover:text-[#6e655c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
            >
              José Ángel Quinto
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                to="/"
                className="hidden text-[10px] uppercase tracking-[0.17em] text-[#716960] transition hover:text-[#211e1b] sm:inline"
              >
                ← {copy.back}
              </Link>
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={copy.changeLanguage}
                className="rounded-full border border-[#d2c9be] bg-white/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#5e5750] transition hover:border-[#ac9f91] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
              >
                {language === "es" ? "ES" : "EN"}
              </button>
            </div>
          </div>
        </nav>

        <main>
          <header
            id="gallery-top"
            className="portfolio-gallery-hero relative overflow-hidden border-b border-[#d8d0c6]"
          >
            <span className="portfolio-gallery-hero-mark" aria-hidden="true">
              06
            </span>
            <div className="relative mx-auto grid min-h-[calc(100svh-65px)] max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:py-24">
              <div className="self-center lg:self-end">
                <Reveal>
                  <p className="mb-7 text-[10px] uppercase tracking-[0.23em] text-[#716960]">
                    {copy.eyebrow}
                  </p>
                </Reveal>
                <Reveal delay={0.06}>
                  <h1 className="max-w-4xl text-[clamp(3.6rem,8vw,8.2rem)] font-normal leading-[0.88] tracking-[-0.06em] text-[#171513]">
                    {copy.title}
                  </h1>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="mt-8 max-w-2xl text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-[#514a43]">
                    {copy.intro}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.14} className="lg:justify-self-end">
                <aside className="w-full rounded-[28px] border border-[#d8d0c6] bg-white/55 p-6 backdrop-blur-sm sm:p-8 lg:max-w-md">
                  <p className="mb-5 text-[9px] uppercase tracking-[0.22em] text-[#928980]">
                    {copy.index}
                  </p>
                  <ol className="divide-y divide-[#ded7ce]">
                    {PORTFOLIO_SHOWCASES.map((project) => (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(project.id)}
                          className="group flex w-full items-center gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
                        >
                          <span className="text-[9px] tabular-nums tracking-[0.18em] text-[#a0978e]">
                            {project.number}
                          </span>
                          <span className="text-sm text-[#39342f] transition group-hover:translate-x-1 group-hover:text-[#171513]">
                            {project.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </aside>
              </Reveal>
            </div>
          </header>

          <div>
            {PORTFOLIO_SHOWCASES.map((project, index) => (
              <section
                id={project.id}
                key={project.id}
                className="portfolio-gallery-project scroll-mt-20 border-b border-[#dcd5cc] py-20 sm:py-28"
                data-tone={String((index % 3) + 1)}
              >
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                  <Reveal>
                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                      <div>
                        <div className="mb-5 flex items-center gap-4">
                          <span className="text-[10px] tabular-nums tracking-[0.2em] text-[#91877d]">
                            {project.number} / 06
                          </span>
                          <span className="h-px w-8 bg-[#a69b90]" aria-hidden="true" />
                          <span className="text-[9px] uppercase tracking-[0.19em] text-[#81776d]">
                            {project.category[language]}
                          </span>
                        </div>
                        <h2 className="text-[clamp(2.65rem,5.8vw,6rem)] leading-[0.94] tracking-[-0.05em] text-[#191613]">
                          {project.title}
                        </h2>
                      </div>

                      <div className="max-w-2xl lg:justify-self-end">
                        <p className="text-sm leading-7 text-[#5f5750]">
                          {project.description[language]}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-5">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-gallery-external group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#27231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
                          >
                            {copy.open}
                            <span aria-hidden="true">↗</span>
                          </a>
                          <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#887f76]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6f7967]" aria-hidden="true" />
                            {copy.live}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.08} className="mt-10 sm:mt-14">
                    <div className="portfolio-gallery-browser">
                      <div className="portfolio-gallery-browser-bar">
                        <div className="flex gap-1.5" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                        <p>{project.domain}</p>
                        <small>{copy.preview}</small>
                      </div>
                      {project.previewImage ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="portfolio-gallery-static-preview"
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
                  </Reveal>
                </div>
              </section>
            ))}
          </div>
        </main>

        <footer className="border-t border-[#d8d0c6] bg-[#1c1917] py-12 text-[#eee9e2]">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9afa5]">
                {copy.footer}
              </p>
              <p className="mt-2 text-xs text-[#847b73]">© {new Date().getFullYear()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/"
                className="text-[10px] uppercase tracking-[0.17em] text-[#d8d0c7] transition hover:text-white"
              >
                ← {copy.back}
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("gallery-top")}
                className="text-[10px] uppercase tracking-[0.17em] text-[#948b82] transition hover:text-white"
              >
                {copy.backToTop} ↑
              </button>
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}
