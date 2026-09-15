import type { ReactNode } from "react";
import { useLanguage } from "../../../translations/LanguageContext";
import Reveal from "./Reveal";

type FeaturedProjectProps = {
  /** Bloque de textos del proyecto dentro de projectsPage. */
  projectKey: "featuredProject" | "featuredProjectDimension";
  sectionId: string;
  /** Número decorativo de la sección ("01", "02"...). */
  sectionNumber: string;
  /** Alterna el fondo para separar dos destacados consecutivos. */
  tone?: "muted" | "light";
  /**
   * "split": textos a la izquierda y puntos fuertes apilados a la derecha.
   * "stacked": textos arriba y puntos fuertes en rejilla de dos columnas debajo,
   * para que no queden huecos cuando los puntos fuertes miden más que los textos.
   */
  layout?: "split" | "stacked";
};

/**
 * Añade un punto de corte opcional entre las partes de un nombre compuesto
 * ("ArcadiaDimension") para que en móvil pase a dos líneas en lugar de
 * desbordar la tarjeta.
 */
function withCompoundBreaks(title: string): ReactNode[] {
  return title
    .replace(/([a-z])([A-Z])/g, "$1\n$2")
    .split("\n")
    .flatMap((part, index) =>
      index === 0 ? [part] : [<wbr key={index} />, part]
    );
}

/**
 * Highlighted project block, placed right after the hero. Unlike the demo
 * cards, each featured project gets a section of its own: they are the largest
 * projects in the portfolio and full-stack applications running in production.
 */
// La sección NO lleva portfolio-section-lazy a propósito. Esa clase aplica
// content-visibility: auto reservando 900px, y esta sección mide ~1200: al
// renderizarse desplazaría casi 300px de contenido, y mientras está diferida no
// responde a los clics aunque ya se vea pintada. Al ir justo después del hero,
// el renderizado diferido no ahorra nada aquí.
export default function FeaturedProject({
  projectKey,
  sectionId,
  sectionNumber,
  tone = "muted",
  layout = "split",
}: FeaturedProjectProps) {
  const { t } = useLanguage();
  const page = t.projectsPage;
  const project = page[projectKey];
  const isStacked = layout === "stacked";
  const hasOddHighlights = project.highlights.length % 2 === 1;

  const heading = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#c2ceba] bg-[#eef2ea] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#4d5b46]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#6f8566]"
            aria-hidden="true"
          />
          {project.statusLabel}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#948b82]">
          {project.kicker}
        </span>
      </div>

      <h2 className="mt-7 text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.045em] text-[#171513]">
        {withCompoundBreaks(project.title)}
      </h2>
    </>
  );

  const description = (
    <p className="mt-7 max-w-[60ch] text-sm leading-7 text-[#5f5851]">
      {project.description}
    </p>
  );

  const tags = (
    <ul
      className={`mt-9 flex flex-wrap gap-2 ${isStacked ? "lg:mt-8" : ""}`}
      aria-label={page.operationalProjectsTechLabel}
    >
      {project.tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-[#e3ddd5] bg-[#faf8f5] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#706860]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );

  const actions = (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
        <a
          href={project.demoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 rounded-full bg-[#1d1a18] px-5 py-3 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#403a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b] focus-visible:ring-offset-3 focus-visible:ring-offset-white"
        >
          {project.demoCta}
          <span
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          >
            {"↗"}
          </span>
        </a>

        <a
          href={project.codeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="portfolio-social-link pb-1 text-[10px] uppercase tracking-[0.16em] text-[#706961] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94887b]"
        >
          {project.codeCta}
        </a>
      </div>

      <p className="mt-7 text-[11px] leading-6 text-[#8f877f]">
        <span className="uppercase tracking-[0.16em]">
          {project.credentialsLabel}
        </span>{" "}
        ·{" "}
        <span className="font-mono text-[#4f4841]">
          {project.credentialsValue}
        </span>
      </p>
    </>
  );

  const highlights = (
    <div
      className={`grid min-w-0 gap-px bg-[#e7e2da] sm:grid-cols-2 ${
        isStacked ? "" : "lg:grid-cols-1"
      }`}
    >
      {project.highlights.map((highlight, index) => {
        // Con un número impar, el último ocupa la fila entera en la rejilla de
        // dos columnas para no dejar una celda vacía.
        const spansRow =
          hasOddHighlights && index === project.highlights.length - 1;

        return (
          <Reveal
            key={highlight.title}
            delay={0.06 + index * 0.05}
            className={
              spansRow
                ? `sm:col-span-2 ${isStacked ? "" : "lg:col-span-1"}`
                : undefined
            }
          >
            <article className="h-full bg-[#fbfaf8] p-7 transition-colors duration-300 hover:bg-white sm:p-8">
              <span className="text-[10px] tabular-nums tracking-[0.2em] text-[#aaa198]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-base leading-snug text-[#211e1b]">
                {highlight.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#69625b]">
                {highlight.description}
              </p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );

  return (
    <section
      id={sectionId}
      className={`relative scroll-mt-20 overflow-hidden border-t border-[#e1dcd5] py-24 sm:py-32 ${
        tone === "light" ? "bg-white" : "bg-[#f7f6f3]"
      }`}
    >
      <span
        className="portfolio-wordmark pointer-events-none absolute -right-5 -top-6 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em]"
        aria-hidden="true"
      >
        {sectionNumber}
      </span>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-8 bg-[#978d82]" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#716a63]">
              {page.featuredEyebrow}
            </span>
          </div>
        </Reveal>

        <div className="overflow-hidden rounded-[32px] border border-[#ded8d0] bg-white shadow-[0_28px_90px_rgba(44,38,32,0.06)]">
          {isStacked ? (
            <div className="grid gap-px bg-[#e7e2da]">
              <div className="min-w-0 bg-white p-8 sm:p-11">
                <Reveal>{heading}</Reveal>

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-14">
                  <Reveal className="min-w-0">{description}</Reveal>
                  <div className="min-w-0">
                    <Reveal delay={0.08}>{tags}</Reveal>
                    <Reveal delay={0.14}>{actions}</Reveal>
                  </div>
                </div>
              </div>

              {highlights}
            </div>
          ) : (
            <div className="grid gap-px bg-[#e7e2da] lg:grid-cols-[1.05fr_0.95fr]">
              <div className="min-w-0 bg-white p-8 sm:p-11">
                <Reveal>
                  {heading}
                  {description}
                </Reveal>
                <Reveal delay={0.08}>{tags}</Reveal>
                <Reveal delay={0.14}>{actions}</Reveal>
              </div>

              {highlights}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
