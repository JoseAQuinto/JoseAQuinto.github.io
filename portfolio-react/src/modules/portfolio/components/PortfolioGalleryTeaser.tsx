import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../translations/LanguageContext";
import { PORTFOLIO_SHOWCASES } from "../portfolioGallery.data";
import HorizontalNames from "../lab/HorizontalNames";
import LabBadge from "../lab/LabBadge";

export default function PortfolioGalleryTeaser() {
  const { language, t } = useLanguage();
  const copy = t.projectsPage.websites;

  return (
    <section
      id="portfolio-websites"
      className="pf-section"
      aria-labelledby="portfolio-websites-title"
    >
      <div className="pf-wrap">
        <LabBadge letter="F" name="Nombres en horizontal con el scroll" />
      </div>
      <HorizontalNames names={PORTFOLIO_SHOWCASES.map((project) => project.title)} />
      <div className="pf-wrap pf-websites__grid">
        <div className="pf-websites__text">
          <span className="pf-aisle" aria-hidden="true" />
          <h2 id="portfolio-websites-title" className="pf-display pf-h2">
            {copy.title}
          </h2>
          <p className="pf-body pf-websites__desc">
            {copy.text}
          </p>
          <Link
            to="/portfolio-gallery"
            className="pf-btn pf-btn--primary pf-websites__cta"
          >
            {copy.cta}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>

        <div className="pf-websites__list">
          <p className="pf-label pf-websites__count">
            {PORTFOLIO_SHOWCASES.length} {copy.countSuffix}
          </p>
          <ul>
            {PORTFOLIO_SHOWCASES.map((project) => (
              <li key={project.id}>
                <strong>{project.title}</strong>
                <span>{project.category[language]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
