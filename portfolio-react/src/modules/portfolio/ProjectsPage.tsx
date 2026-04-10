import { useEffect, useState, useRef } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";

export default function ProjectsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const heroRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t } = useLanguage();

  const page = t.projectsPage;
  const common = t.common;

  useEffect(() => {
    const tmr = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(tmr);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sections = ["about", "projects"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection("hero");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "about", label: page.aboutTitle },
    { id: "projects", label: page.projectsTitle },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#1a1a1a] overflow-x-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f7f6f3]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex items-center justify-between py-5">
            {/* Name / logo */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group focus-visible:outline-none"
            >
              <span
                className="text-sm font-normal tracking-[0.18em] uppercase text-[#1a1a1a] group-hover:text-[#555] transition-colors"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.18em" }}
              >
                José Ángel Quinto
              </span>
            </button>

            {/* Center nav — plain text links */}
            <div className="hidden sm:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() =>
                    document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className={`text-xs tracking-[0.14em] uppercase transition-all duration-200 pb-0.5 ${
                    activeSection === link.id
                      ? "text-[#1a1a1a] border-b border-[#1a1a1a]"
                      : "text-[#888] hover:text-[#1a1a1a]"
                  }`}
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label={common.changeLanguageAriaLabel}
              type="button"
              className="text-xs tracking-[0.14em] uppercase text-[#888] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
        <div className="h-px bg-[#ddd]" />
      </nav>

      {/* ── HERO ── */}
      <header ref={heroRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#f7f6f3]">

        {/* Thin vertical rule — decorative */}
        <div className="pointer-events-none absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent to-[#ccc]" />

        {/* Hero content — bottom-aligned, editorial */}
        <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-8 pb-24 pt-36">

          {/* Status line */}
          <div
            className={`mb-10 flex items-center gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="h-px w-8 bg-[#999]" />
            <span
              className="text-[10px] tracking-[0.22em] uppercase text-[#777]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {page.badge}
            </span>
          </div>

          {/* Main heading — large but measured */}
          <h1
            className={`text-[clamp(2.4rem,7vw,5.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[#1a1a1a] transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms", fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {page.title}
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-5 text-lg text-[#444] font-normal leading-relaxed max-w-xl transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "320ms", fontFamily: "'Georgia', serif" }}
          >
            {page.subtitle}
          </p>

          {/* Intro */}
          <p
            className={`mt-4 max-w-lg text-sm leading-[1.85] text-[#666] transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms", fontFamily: "'Georgia', serif" }}
          >
            {page.intro}
          </p>

          {/* Divider */}
          <div
            className={`mt-10 h-px w-full max-w-lg bg-[#ddd] transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "480ms" }}
          />

          {/* CTAs + links — understated */}
          <div
            className={`mt-8 flex flex-wrap items-center gap-6 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "520ms" }}
          >
            <button
              type="button"
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#555] hover:border-[#555] transition-colors focus-visible:outline-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {page.projectsTitle}
              <ArrowRightIcon size={12} />
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#777] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5 focus-visible:outline-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {page.aboutTitle}
            </button>

            <div className="h-4 w-px bg-[#ccc]" />

            <a
              href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.14em] uppercase text-[#777] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.14em] uppercase text-[#777] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              GitHub
            </a>
          </div>

          {/* Tech stack — minimal */}
          <div
            className={`mt-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "620ms" }}
          >
            <p
              className="mb-3 text-[10px] tracking-[0.22em] uppercase text-[#999]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Stack
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {page.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs text-[#666]"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#ddd]" />

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 right-8 flex flex-col items-center gap-2 transition-all duration-1000 ${
            mounted ? "opacity-40" : "opacity-0"
          }`}
          style={{ transitionDelay: "1400ms" }}
        >
          <div className="h-10 w-px bg-gradient-to-b from-[#999] to-transparent" />
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section id="about" className="relative bg-white py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          {/* Section header */}
          <div className="mb-16 flex items-center gap-6">
            <div className="h-px w-6 bg-[#999]" />
            <h2
              className="text-[10px] tracking-[0.22em] uppercase text-[#777]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {page.aboutTitle}
            </h2>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            {page.experience.map((item, index) => (
              <article
                key={index}
                className="group relative border-t border-[#e8e8e8] p-8 hover:bg-[#fafafa] transition-colors duration-300 first:border-t-0 md:first:border-t md:[&:nth-child(2)]:border-t-0 md:odd:border-r md:border-r-[#e8e8e8]"
              >
                {/* Index */}
                <span
                  className="block mb-5 text-[10px] tracking-[0.2em] text-[#bbb] tabular-nums"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mb-3 text-base font-normal text-[#1a1a1a] leading-snug"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-[1.9] text-[#666]"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="relative py-28 bg-[#f7f6f3]">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          {/* Section header */}
          <div className="mb-4 flex items-center gap-6">
            <div className="h-px w-6 bg-[#999]" />
            <h2
              className="text-[10px] tracking-[0.22em] uppercase text-[#777]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {page.projectsTitle}
            </h2>
          </div>

          <p
            className="mb-16 text-sm text-[#999] pl-12"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {page.projectsSubtitle}
          </p>

          {/* Projects list — editorial table style */}
          <div className="divide-y divide-[#e0ddd8]">
            {page.projects.map((project, index) => (
              <article
                key={project.id}
                className={`group py-8 transition-all duration-700 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                  {/* Index */}
                  <span
                    className="flex-shrink-0 w-10 text-[11px] tracking-[0.18em] text-[#bbb] tabular-nums pt-0.5"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-3">
                      <h3
                        className="text-xl font-normal text-[#1a1a1a] group-hover:text-[#333] transition-colors"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {project.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] tracking-[0.14em] uppercase text-[#999]"
                            style={{ fontFamily: "'Georgia', serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p
                      className="text-sm leading-[1.85] text-[#666] max-w-xl mb-5"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {project.description}
                    </p>

                    <Link
                      to={project.href}
                      className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#555] border-b border-[#bbb] pb-0.5 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors focus-visible:outline-none"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {project.cta}
                      <ArrowRightIcon size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BackToTop ariaLabel={common.backToTop} />

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#ddd] bg-white py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p
              className="text-xs tracking-[0.14em] text-[#999]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              © {new Date().getFullYear()} {page.footer}
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.14em] uppercase text-[#999] hover:text-[#1a1a1a] transition-colors"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.14em] uppercase text-[#999] hover:text-[#1a1a1a] transition-colors"
                style={{ fontFamily: "'Georgia', serif" }}
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
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-9 h-9 border border-[#ccc] bg-white text-[#666] shadow-sm transition-all duration-300 hover:border-[#999] hover:text-[#1a1a1a] active:scale-95 focus-visible:outline-none ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon size={14} />
    </button>
  );
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number; viewBox?: string; className?: string; children?: ReactNode };

function Icon({ size = 16, viewBox = "0 0 24 24", className = "", children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {children}
    </svg>
  );
}

function ArrowUpIcon({ size = 14, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </Icon>
  );
}

function ArrowRightIcon({ size = 12, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
    </Icon>
  );
}