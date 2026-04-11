import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";

const editorialFont = "'Georgia', 'Times New Roman', serif";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FadeUp({
  show,
  delay = 0,
  y = 18,
  className = "",
  children,
}: {
  show: boolean;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "transition-[opacity,transform] duration-700 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transform: show ? "translateY(0px)" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

export default function ProjectsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t } = useLanguage();

  const page = t.projectsPage;
  const common = t.common;

  useEffect(() => {
    const tmr = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(tmr);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const heroEl = heroRef.current;
    if (heroEl) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection("hero");
          }
        },
        { threshold: 0.35 }
      );
      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }

    const sections = ["about", "projects"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: "-18% 0px -58% 0px",
          threshold: 0.02,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const navLinks = useMemo(
    () => [
      { id: "about", label: page.aboutTitle },
      { id: "projects", label: page.projectsTitle },
    ],
    [page.aboutTitle, page.projectsTitle]
  );

  const baseFocusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2";
  const focusOnWarm = `${baseFocusRing} focus-visible:ring-offset-[#f7f6f3]`;
  const focusOnWhite = `${baseFocusRing} focus-visible:ring-offset-white`;

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f6f3] text-[#1a1a1a]"
      style={{ fontFamily: editorialFont }}
    >
      {/* ── NAV ── */}
      <nav
        className={cx(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#f7f6f3]/88 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "bg-[#f7f6f3]/94 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex items-center justify-between py-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={cx(
                "group relative rounded-sm transition-colors duration-200 active:translate-y-[1px]",
                focusOnWarm
              )}
            >
              <span
                className="text-sm font-normal uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#57534e]"
                style={{ fontFamily: editorialFont }}
              >
                José Ángel Quinto
              </span>
            </button>

            <div className="hidden items-center gap-8 sm:flex">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className={cx(
                      "group relative rounded-sm pb-1 text-xs uppercase tracking-[0.14em] transition-[color,transform] duration-200 active:translate-y-[1px]",
                      isActive
                        ? "text-[#1a1a1a]"
                        : "text-[#8a847c] hover:text-[#1a1a1a]",
                      focusOnWarm
                    )}
                    style={{ fontFamily: editorialFont }}
                  >
                    {link.label}
                    <span
                      className={cx(
                        "absolute bottom-0 left-0 h-px bg-current transition-all duration-250",
                        isActive ? "w-full opacity-100" : "w-0 opacity-60 group-hover:w-full"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <button
              onClick={toggleLanguage}
              aria-label={common.changeLanguageAriaLabel}
              type="button"
              className={cx(
                "rounded-sm text-xs uppercase tracking-[0.14em] text-[#8a847c] transition-colors duration-200 hover:text-[#1a1a1a] active:translate-y-[1px]",
                focusOnWarm
              )}
              style={{ fontFamily: editorialFont }}
            >
              {language === "es" ? "ES" : "EN"}
            </button>
          </div>
        </div>

        <div className="h-px bg-[#ddd9d3]" />
      </nav>

      {/* ── HERO ── */}
      <header
        ref={heroRef}
        className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-[#f7f6f3]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-40 w-px bg-gradient-to-b from-transparent to-[#ccc7bf]" />
          <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-gradient-to-t from-[#f1eee8]/55 via-transparent to-transparent" />
          <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-[#efe9df] opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-36 sm:px-8">
          <FadeUp show={mounted} delay={80} y={12} className="mb-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-[#9f988e]" />
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#777068]"
                style={{ fontFamily: editorialFont }}
              >
                {page.badge}
              </span>
            </div>
          </FadeUp>

          <FadeUp show={mounted} delay={180} y={22}>
            <h1
              className="max-w-4xl text-[clamp(2.5rem,7vw,5.8rem)] font-normal leading-[1.03] tracking-[-0.03em] text-[#171717]"
              style={{ fontFamily: editorialFont }}
            >
              {page.title}
            </h1>
          </FadeUp>

          <FadeUp show={mounted} delay={300} y={14}>
            <p
              className="mt-6 max-w-2xl text-[1.03rem] font-normal leading-[1.8] text-[#403b36]"
              style={{ fontFamily: editorialFont }}
            >
              {page.subtitle}
            </p>
          </FadeUp>

          <FadeUp show={mounted} delay={390} y={14}>
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
              <p
                className="max-w-xl text-sm leading-[1.95] text-[#66615b]"
                style={{ fontFamily: editorialFont }}
              >
                {page.intro}
              </p>

              <div className="hidden lg:block">
                <div className="rounded-[22px] border border-[#e4dfd8] bg-white/50 px-5 py-5 backdrop-blur-sm">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-[#9b948a]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.heroAsideTitle}
                  </p>
                  <p
                    className="mt-3 text-sm leading-[1.85] text-[#5f5952]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.heroAsideText}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp show={mounted} delay={470} y={0}>
            <div className="mt-10 h-px w-full max-w-2xl bg-[#ddd7cf]" />
          </FadeUp>

          <FadeUp show={mounted} delay={540} y={12}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={cx(
                  "group inline-flex items-center gap-2 rounded-sm border-b border-[#1a1a1a] pb-0.5 text-xs uppercase tracking-[0.14em] text-[#1a1a1a] transition-[color,border-color,transform] duration-200 hover:border-[#5d5750] hover:text-[#5d5750] active:translate-y-[1px]",
                  focusOnWarm
                )}
                style={{ fontFamily: editorialFont }}
              >
                {page.projectsTitle}
                <ArrowRightIcon
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={cx(
                  "rounded-sm border-b border-transparent pb-0.5 text-xs uppercase tracking-[0.14em] text-[#7e7870] transition-[color,border-color,transform] duration-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:translate-y-[1px]",
                  focusOnWarm
                )}
                style={{ fontFamily: editorialFont }}
              >
                {page.aboutTitle}
              </button>

              <div className="h-4 w-px bg-[#cdc7be]" />

              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "rounded-sm border-b border-transparent pb-0.5 text-xs uppercase tracking-[0.14em] text-[#7e7870] transition-[color,border-color,transform] duration-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:translate-y-[1px]",
                  focusOnWarm
                )}
                style={{ fontFamily: editorialFont }}
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "rounded-sm border-b border-transparent pb-0.5 text-xs uppercase tracking-[0.14em] text-[#7e7870] transition-[color,border-color,transform] duration-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:translate-y-[1px]",
                  focusOnWarm
                )}
                style={{ fontFamily: editorialFont }}
              >
                GitHub
              </a>
            </div>
          </FadeUp>

          <FadeUp show={mounted} delay={640} y={14}>
            <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
              <div>
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#989187]"
                  style={{ fontFamily: editorialFont }}
                >
                  {page.techStackTitle}
                </p>

                <div className="flex flex-wrap gap-2">
                  {page.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full border border-[#e3ddd4] bg-[#fbfaf8] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#746f69] transition-colors duration-200 hover:border-[#d4ccc1] hover:bg-white"
                      style={{ fontFamily: editorialFont }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex lg:justify-end">
                <div className="flex items-center gap-3 text-right">
                  <div className="h-8 w-px bg-[#d8d2c9]" />
                  <p
                    className="max-w-[160px] text-[11px] leading-[1.8] text-[#8f887e]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.heroBottomNote}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#ddd7cf]" />

        <div
          className={cx(
            "absolute bottom-8 right-8 flex flex-col items-center gap-2 transition-all duration-1000",
            mounted ? "opacity-40" : "opacity-0"
          )}
          style={{ transitionDelay: "1300ms" }}
        >
          <div className="h-10 w-px bg-gradient-to-b from-[#9e968c] to-transparent" />
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section id="about" className="relative scroll-mt-28 bg-white py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-6">
              <div className="h-px w-6 bg-[#999189]" />
              <h2
                className="text-[10px] uppercase tracking-[0.22em] text-[#777068]"
                style={{ fontFamily: editorialFont }}
              >
                {page.aboutTitle}
              </h2>
            </div>

            <p
              className="max-w-xl text-sm leading-[1.9] text-[#6d655f]"
              style={{ fontFamily: editorialFont }}
            >
              {page.aboutSectionNote}
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            {page.experience.map((item, index) => (
              <article
                key={index}
                className="group relative border-t border-[#e8e4de] p-8 transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:bg-[#fcfbf8] first:border-t-0 md:first:border-t md:[&:nth-child(2)]:border-t-0 md:odd:border-r md:border-r-[#e8e4de]"
              >
                <div className="absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-[#cfc6ba] transition-transform duration-300 group-hover:scale-x-100" />

                <span
                  className="mb-5 block text-[10px] tabular-nums tracking-[0.2em] text-[#b7b0a8]"
                  style={{ fontFamily: editorialFont }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3
                  className="mb-3 max-w-[22ch] text-[1.04rem] font-normal leading-[1.5] text-[#171717] transition-colors duration-200 group-hover:text-[#000]"
                  style={{ fontFamily: editorialFont }}
                >
                  {item.title}
                </h3>

                <p
                  className="max-w-[54ch] text-sm leading-[1.95] text-[#66615c]"
                  style={{ fontFamily: editorialFont }}
                >
                  {item.description}
                </p>

                <div className="mt-7 flex items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                  <div className="h-px w-8 bg-[#cfc6ba]" />
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] text-[#8b847b]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.aboutDetailLabel}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="relative scroll-mt-28 bg-[#f7f6f3] py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                className="inline-block text-[10px] uppercase tracking-[0.22em] text-[#8a8279]"
                style={{ fontFamily: editorialFont }}
              >
                {page.projectsEyebrow}
              </span>

              <h2
                className="mt-3 text-[clamp(1.9rem,4vw,3.25rem)] font-normal leading-tight text-[#171717]"
                style={{ fontFamily: editorialFont }}
              >
                {page.projectsTitle}
              </h2>
            </div>

            <p
              className="max-w-xl text-sm leading-[1.95] text-[#66615c]"
              style={{ fontFamily: editorialFont }}
            >
              {page.projectsSubtitle}
            </p>
          </div>

          <div className="grid gap-5">
            {page.projects.map((project, index) => (
              <article
                key={project.id}
                className={cx(
                  "group relative overflow-hidden rounded-[30px] border border-[#e5dfd6] bg-white/88 p-6 shadow-[0_1px_0_rgba(0,0,0,0.025)] backdrop-blur-sm transition-[box-shadow,border-color,background-color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#d8cfc3] hover:bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.045)] sm:p-8",
                  mounted ? "opacity-100" : "opacity-0 translate-y-5"
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8d0c5] to-transparent opacity-90" />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f2ede5] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center gap-4">
                      <span
                        className="text-[0.95rem] leading-none text-[#c1b8ac]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px w-10 bg-[#ddd5cb]" />
                    </div>

                    <div className="max-w-3xl">
                      <h3
                        className="text-[1.55rem] font-normal leading-[1.14] tracking-[-0.012em] text-[#161616] transition-colors duration-300 group-hover:text-[#000]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="mt-4 max-w-[64ch] text-[13px] leading-[1.98] text-[#6b655f]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-[#e7e0d7] bg-[#fbfaf7] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#79736b] transition-[border-color,background-color,color] duration-200 group-hover:border-[#ddd3c7] group-hover:bg-white"
                          style={{ fontFamily: editorialFont }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 hidden sm:flex sm:items-center sm:gap-3">
                      <div className="relative h-px w-12 overflow-hidden bg-[#e4ddd4]">
                        <span className="absolute inset-y-0 left-0 w-6 bg-[#cfc6ba] transition-all duration-500 ease-out group-hover:w-full" />
                      </div>

                      <span
                        className="translate-x-0 text-[10px] uppercase tracking-[0.18em] text-[#958e84] opacity-75 transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-[#6f685f]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {page.projectFootnote}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="relative flex w-full flex-col justify-between gap-8 lg:w-[220px] lg:self-stretch lg:pl-8">
                    <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-[#eee8df] lg:block" />

                    <div className="flex items-center justify-between lg:flex-col lg:items-end lg:gap-3">
                      <div className="flex flex-col gap-1 lg:items-end">
                        <span
                          className="text-[10px] uppercase tracking-[0.18em] text-[#8f887f]"
                          style={{ fontFamily: editorialFont }}
                        >
                          {page.projectMetaLabel}
                        </span>
                        <span
                          className="text-[11px] text-[#b0a89f]"
                          style={{ fontFamily: editorialFont }}
                        >
                          {page.projectMetaSubLabel}
                        </span>
                      </div>

                      <span
                        className="rounded-full border border-[#ece6dd] bg-[#faf8f4] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#978f86]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {page.projectYear}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 lg:items-end">
                      <div className="flex items-center gap-3 text-left lg:text-right">
                        <div className="h-8 w-px bg-[#ddd5cb]" />
                        <p
                          className="max-w-[170px] text-[11px] leading-[1.8] text-[#8f887f]"
                          style={{ fontFamily: editorialFont }}
                        >
                          {page.projectSideDescription}
                        </p>
                      </div>

                      <Link
                        to={project.href}
                        className={cx(
                          "inline-flex items-center gap-2.5 self-start rounded-full border border-[#d8d0c6] bg-[#f8f6f2] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#3f3b37] transition-all duration-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white active:translate-y-[1px] lg:self-end",
                          focusOnWhite
                        )}
                        style={{ fontFamily: editorialFont }}
                      >
                        <span>{project.cta}</span>
                        <ArrowRightIcon
                          size={11}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BackToTop ariaLabel={common.backToTop} />

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#ddd7cf] bg-white py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p
              className="text-xs tracking-[0.14em] text-[#999189]"
              style={{ fontFamily: editorialFont }}
            >
              © {new Date().getFullYear()} {page.footer}
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "rounded-sm text-xs uppercase tracking-[0.14em] text-[#999189] transition-colors duration-200 hover:text-[#1a1a1a] active:translate-y-[1px]",
                  focusOnWhite
                )}
                style={{ fontFamily: editorialFont }}
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "rounded-sm text-xs uppercase tracking-[0.14em] text-[#999189] transition-colors duration-200 hover:text-[#1a1a1a] active:translate-y-[1px]",
                  focusOnWhite
                )}
                style={{ fontFamily: editorialFont }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BackToTop({ ariaLabel }: { ariaLabel: string }) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      type="button"
      aria-label={ariaLabel}
      className={cx(
        "fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c7] bg-white/95 text-[#66615c] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#aaa095] hover:text-[#1a1a1a] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f6f3]",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUpIcon size={14} />
    </button>
  );
}

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  viewBox?: string;
  className?: string;
  children?: ReactNode;
};

function Icon({
  size = 16,
  viewBox = "0 0 24 24",
  className = "",
  children,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

function ArrowUpIcon({
  size = 14,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </Icon>
  );
}

function ArrowRightIcon({
  size = 12,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </Icon>
  );
}