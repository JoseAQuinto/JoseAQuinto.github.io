import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { PortfolioProject } from "../portfolio.types";

type ProjectCardProps = {
  project: PortfolioProject;
  techLabel: string;
};

/**
 * Fila del listado de demos. Las demos internas navegan con el router
 * (HashRouter); Visual Planner es una página estática aparte.
 */
export default function ProjectCard({ project, techLabel }: ProjectCardProps) {
  const linkContent = (
    <>
      {project.cta}
      <span className="pf-sr-only">: {project.title}</span>
      <ArrowRightIcon aria-hidden="true" />
    </>
  );

  return (
    <li className="pf-row">
      <h4 className="pf-row__title">{project.title}</h4>

      <div>
        <p className="pf-row__desc">{project.description}</p>
        <ul className="pf-tags" aria-label={techLabel}>
          {project.tags.map((tag) => (
            <li key={tag} className="pf-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="pf-row__action">
        {project.standalone ? (
          <a href={project.href} className="pf-btn pf-btn--ghost pf-btn--small">
            {linkContent}
          </a>
        ) : (
          <Link to={project.href} className="pf-btn pf-btn--ghost pf-btn--small">
            {linkContent}
          </Link>
        )}
      </div>
    </li>
  );
}
