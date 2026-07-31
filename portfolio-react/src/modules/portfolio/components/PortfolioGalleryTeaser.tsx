import { Link } from "react-router-dom";
import { useLanguage } from "../../../translations/LanguageContext";
import { PORTFOLIO_SHOWCASES } from "../portfolioGallery.data";
import Reveal from "./Reveal";

const copy = {
  es: {
    eyebrow: "Portfolios web",
    title: "Una web distinta para cada historia.",
    description:
      "Además de producto digital, diseño portfolios y webs de presentación donde la identidad visual se adapta por completo a cada perfil, sector o celebración.",
    cta: "Explorar la galería",
    count: "6 propuestas publicadas",
  },
  en: {
    eyebrow: "Web portfolios",
    title: "A different website for every story.",
    description:
      "Alongside digital products, I design portfolios and presentation websites whose visual identity is fully adapted to each profile, field or celebration.",
    cta: "Explore the gallery",
    count: "6 published concepts",
  },
} as const;

export default function PortfolioGalleryTeaser() {
  const { language } = useLanguage();
  const content = copy[language];

  return (
    <section
      id="portfolio-websites"
      className="portfolio-section-lazy relative scroll-mt-20 overflow-hidden border-t border-[#e1dcd5] bg-white py-24 sm:py-32"
    >
      <span
        className="portfolio-wordmark pointer-events-none absolute -right-5 -top-3 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em]"
        aria-hidden="true"
      >
        04
      </span>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <Reveal>
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-[#978d82]" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#716a63]">
                {content.eyebrow}
              </span>
            </div>

            <h2 className="text-[clamp(2.5rem,5.8vw,5.25rem)] leading-[0.96] tracking-[-0.045em] text-[#181614]">
              {content.title}
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#655e57]">
              {content.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/portfolio-gallery"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1d1a18] px-5 py-3 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#403a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-3"
              >
                {content.cta}
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#948b82]">
                {content.count}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="portfolio-gallery-teaser-grid" aria-hidden="true">
            {PORTFOLIO_SHOWCASES.slice(0, 3).map((project, index) => (
              <div className="portfolio-gallery-teaser-card" key={project.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{project.title}</p>
                <small>{project.category[language]}</small>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
