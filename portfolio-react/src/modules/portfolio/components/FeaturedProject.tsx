import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

export type FeaturedProjectCopy = {
  title: string;
  kicker: string;
  statusLabel: string;
  description: string;
  highlights: readonly { title: string; description: string }[];
  tags: readonly string[];
  demoHref: string;
  demoCta: string;
  codeHref: string;
  codeCta: string;
  credentialsLabel: string;
  credentialsValue: string;
};

type FeaturedProjectProps = {
  id: string;
  project: FeaturedProjectCopy;
  featuredLabel: string;
  techLabel: string;
  pointsLabel: string;
  /** "side": puntos fuertes en columna lateral. "wide": debajo, en dos columnas. */
  layout?: "side" | "wide";
};

/**
 * Añade un punto de corte opcional entre las partes de un nombre compuesto
 * ("ArcadiaDimension") para que en móvil pase a dos líneas en lugar de
 * desbordar.
 */
function withCompoundBreaks(title: string): ReactNode[] {
  return title
    .replace(/([a-z])([A-Z])/g, "$1\n$2")
    .split("\n")
    .flatMap((part, index) =>
      index === 0 ? [part] : [<wbr key={index} />, part]
    );
}

export default function FeaturedProject({
  id,
  project,
  featuredLabel,
  techLabel,
  pointsLabel,
  layout = "side",
}: FeaturedProjectProps) {
  const headingId = `${id}-title`;

  return (
    <article
      id={id}
      className={`pf-feature${layout === "wide" ? " pf-feature--wide" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="pf-feature__main">
        <div className="pf-feature__head">
          <div className="pf-feature__meta">
            <span className="pf-status">{project.statusLabel}</span>
            <span className="pf-label">
              {featuredLabel}. {project.kicker}
            </span>
          </div>

          <h3 id={headingId} className="pf-display pf-feature__title">
            {withCompoundBreaks(project.title)}
          </h3>
        </div>

        <p className="pf-body pf-feature__desc">{project.description}</p>

        <div>
          <ul className="pf-tags pf-feature__tags" aria-label={techLabel}>
            {project.tags.map((tag) => (
              <li key={tag} className="pf-tag">
                {tag}
              </li>
            ))}
          </ul>

          <div className="pf-feature__actions">
            <a
              href={project.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-btn pf-btn--primary"
            >
              {project.demoCta}
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
            <a
              href={project.codeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-link"
            >
              {project.codeCta}
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </div>

          <p className="pf-credentials">
            <span className="pf-label">{project.credentialsLabel}</span>
            <code>{project.credentialsValue}</code>
          </p>
        </div>
      </div>

      <ul className="pf-feature__points" aria-label={pointsLabel}>
        {project.highlights.map((highlight) => (
          <li key={highlight.title} className="pf-point">
            <h4 className="pf-h4">{highlight.title}</h4>
            <p>{highlight.description}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
