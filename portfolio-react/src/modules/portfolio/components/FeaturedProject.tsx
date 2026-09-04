import { useLanguage } from "../../../translations/LanguageContext";
import Reveal from "./Reveal";

/**
 * Highlighted project block, placed right after the hero. Unlike the demo
 * cards, this one gets a section of its own: it is the largest project in the
 * portfolio and the only full-stack application running in production.
 */
export default function FeaturedProject() {
  const { t } = useLanguage();
  const page = t.projectsPage;
  const project = page.featuredProject;

  return (
    <section
      id="featured-project"
      className="portfolio-section-lazy relative scroll-mt-20 overflow-hidden border-t border-[#e1dcd5] bg-[#f7f6f3] py-24 sm:py-32"
    >
      <span
        className="portfolio-wordmark pointer-events-none absolute -right-5 -top-6 text-[clamp(7rem,20vw,17rem)] leading-none tracking-[-0.06em]"
        aria-hidden="true"
      >
        01
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
          <div className="grid gap-px bg-[#e7e2da] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-white p-8 sm:p-11">
              <Reveal>
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
                  {project.title}
                </h2>

                <p className="mt-7 max-w-[60ch] text-sm leading-7 text-[#5f5851]">
                  {project.description}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <ul
                  className="mt-9 flex flex-wrap gap-2"
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
              </Reveal>

              <Reveal delay={0.14}>
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
              </Reveal>
            </div>

            <div className="grid gap-px bg-[#e7e2da] sm:grid-cols-2 lg:grid-cols-1">
              {project.highlights.map((highlight, index) => (
                <Reveal key={highlight.title} delay={0.06 + index * 0.05}>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
