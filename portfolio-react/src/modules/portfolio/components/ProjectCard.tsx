import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import type {
  PortfolioProject,
  ProjectCardCopy,
} from "../portfolio.types";

type ProjectCardProps = {
  copy: ProjectCardCopy;
  index: number;
  project: PortfolioProject;
};

export default function ProjectCard({
  copy,
  index,
  project,
}: ProjectCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.article
      className="portfolio-project-card group relative overflow-hidden rounded-[28px] border border-[#ded8cf] bg-white/80 p-6 sm:p-8"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_210px] lg:gap-10">
        <div>
          <div className="mb-7 flex items-center gap-4 text-[#aaa198]">
            <span className="text-xs tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-10 bg-[#d5cec5]" />
            <span className="text-[9px] uppercase tracking-[0.2em]">
              {copy.projectFootnote}
            </span>
          </div>

          <h3 className="text-[clamp(1.55rem,3vw,2.25rem)] leading-tight tracking-[-0.02em] text-[#181614]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[68ch] text-sm leading-7 text-[#625b54]">
            {project.description}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Tecnologías">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[#e3ddd5] bg-[#faf8f5] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#706860]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-7 border-t border-[#e5dfd7] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#8f867d]">
              {copy.projectMetaLabel}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#aaa198]">
              {copy.projectMetaSubLabel} · {copy.projectYear}
            </p>
          </div>

          <Link
            to={project.href}
            className="portfolio-project-link inline-flex w-fit items-center gap-3 rounded-full border border-[#cfc6bb] bg-[#f8f5f1] px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] text-[#2d2925] transition-colors hover:border-[#a99d90] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-3"
          >
            {project.cta}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </m.article>
  );
}
