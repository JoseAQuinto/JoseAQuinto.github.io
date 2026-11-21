import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import type { PortfolioProject } from "../portfolio.types";

/**
 * Efecto C: estantería. Cada fila entra desde un lado (alternando) y se
 * coloca en su sitio siguiendo el scroll; la marca ámbar de la izquierda se
 * llena a la vez, como un hueco que se ocupa.
 */
export default function ShelfRow({
  project,
  index,
  techLabel,
}: {
  project: PortfolioProject;
  index: number;
  techLabel: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.55"],
  });
  const from = index % 2 === 0 ? -90 : 90;
  const x = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.6, 1]);
  const fill = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  const linkContent = (
    <>
      {project.cta}
      <span className="pf-sr-only">: {project.title}</span>
      <ArrowRightIcon aria-hidden="true" />
    </>
  );

  return (
    <motion.li
      ref={ref}
      className="pf-row lab-shelf-row"
      style={reduceMotion ? undefined : { x, opacity }}
    >
      <motion.span
        className="lab-shelf-row__fill"
        aria-hidden="true"
        style={reduceMotion ? { scaleY: 1 } : { scaleY: fill }}
      />
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
    </motion.li>
  );
}
