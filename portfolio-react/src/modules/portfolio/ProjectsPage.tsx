import { useEffect, useState, useRef } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";

export default function ProjectsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
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

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      setCursorPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const navLinks = [
    { id: "about", label: page.aboutTitle },
    { id: "projects", label: page.projectsTitle },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2 focus-visible:outline-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm select-none group-hover:bg-indigo-500 transition-colors">
                JQ
              </span>
              <span className="hidden sm:block text-sm font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors">
                portfolio
              </span>
            </button>

            {/* Center pill nav */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() =>
                    document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeSection === link.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <button
              onClick={toggleLanguage}
              aria-label={common.changeLanguageAriaLabel}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 transition-all hover:border-zinc-300 hover:text-zinc-900 active:scale-95"
            >
              <GlobeIcon size={13} />
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
        <div className="h-px bg-zinc-100" />
      </nav>

      {/* ── HERO ── */}
      <header ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
        {/* Dynamic spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(700px circle at ${cursorPos.x}% ${cursorPos.y}%, rgba(99,102,241,0.06), transparent 70%)`,
          }}
        />

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-indigo-100/80 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 left-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Floating code snippets */}
        <div
          className={`pointer-events-none absolute top-32 right-8 hidden lg:block transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="rounded-2xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur-sm p-4 font-mono text-xs text-zinc-400 leading-relaxed max-w-[230px]">
            <span className="text-violet-500">const</span>{" "}
            <span className="text-indigo-600">dev</span>{" "}
            <span className="text-zinc-400">=</span>{" "}
            <span className="text-zinc-700">&#123;</span>
            <br />
            {"  "}<span className="text-sky-500">stack</span>
            <span className="text-zinc-400">:</span>{" "}
            <span className="text-amber-500">"full"</span>
            <span className="text-zinc-400">,</span>
            <br />
            {"  "}<span className="text-sky-500">passion</span>
            <span className="text-zinc-400">:</span>{" "}
            <span className="text-emerald-500">true</span>
            <br />
            <span className="text-zinc-700">&#125;</span>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute bottom-40 right-16 hidden xl:block transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "1000ms" }}
        >
          <div className="rounded-2xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur-sm p-4 font-mono text-xs text-zinc-400 leading-relaxed max-w-[210px]">
            <span className="text-pink-500">async</span>{" "}
            <span className="text-indigo-600">solve</span>
            <span className="text-zinc-400">(</span>
            <span className="text-amber-500">problem</span>
            <span className="text-zinc-400">) &#123;</span>
            <br />
            {"  "}<span className="text-violet-500">return</span>{" "}
            <span className="text-emerald-500">solution</span>
            <br />
            <span className="text-zinc-400">&#125;</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
          <div className="max-w-3xl">

            {/* Badge */}
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 transition-all duration-500 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              {page.badge}
            </div>

            {/* Heading */}
            <h1
              className={`text-5xl font-black tracking-tight text-zinc-900 sm:text-7xl lg:text-8xl transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "200ms", lineHeight: 1.05 }}
            >
              {page.title}
            </h1>

            {/* Gradient subtitle */}
            <p
              className={`mt-5 text-xl font-bold transition-all duration-700 sm:text-2xl ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "280ms" }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                {page.subtitle}
              </span>
            </p>

            {/* Intro */}
            <p
              className={`mt-4 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "340ms" }}
            >
              {page.intro}
            </p>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "440ms" }}
            >
              <button
                type="button"
                onClick={() =>
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-indigo-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                {page.projectsTitle}
                <ArrowRightIcon size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
              >
                {page.aboutTitle}
                <ChevronDownIcon size={16} />
              </button>

              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
              >
                <LinkedinIcon size={16} />
                LinkedIn
              </a>

              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-400 hover:text-zinc-900 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
              >
                <GithubIcon size={16} />
                GitHub
              </a>
            </div>

            {/* Tech stack */}
            <div
              className={`mt-10 transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "540ms" }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {page.techStack.map((tech, i) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                    style={{ transitionDelay: `${540 + i * 40}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-all duration-1000 ${
            mounted ? "opacity-30" : "opacity-0"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-zinc-400 to-transparent" />
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section id="about" className="relative bg-zinc-50 py-28">
        <div className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

          <h2 className="mb-12 text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">
            {page.aboutTitle}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {page.experience.map((item, index) => (
              <article
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-violet-50/0 transition-all duration-500 group-hover:from-indigo-50/60 group-hover:to-violet-50/40" />

                <div className="relative mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                  <div className="flex-shrink-0 rounded-lg border border-indigo-100 bg-indigo-50 p-2">
                    <CodeIcon size={18} className="text-indigo-600" />
                  </div>
                </div>
                <p className="relative text-sm leading-relaxed text-zinc-500">{item.description}</p>

                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="relative py-28 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.04),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">
                {page.projectsTitle}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">{page.projectsSubtitle}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.projects.map((project, index) => (
              <article
                key={project.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-500 hover:border-indigo-200 hover:-translate-y-1.5 hover:shadow-lg ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${500 + index * 120}ms` }}
              >
                {/* Top accent line on hover */}
                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Hover tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/0 to-violet-50/0 transition-all duration-500 group-hover:from-indigo-50/30 group-hover:to-violet-50/20" />

                {/* Big index number */}
                <div className="absolute right-5 top-5 font-mono text-4xl font-black text-zinc-100 select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg border border-indigo-100 bg-indigo-50 p-2 flex-shrink-0">
                      <FolderIcon size={18} className="text-indigo-600" />
                    </div>
                  </div>

                  <h3 className="mt-1 text-lg font-bold text-zinc-900">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link
                      to={project.href}
                      className="group/btn inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                    >
                      {project.cta}
                      <ArrowRightIcon
                        size={15}
                        className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                      />
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
      <footer className="border-t border-zinc-100 bg-zinc-50 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 font-black text-xs">
                JQ
              </span>
              <p className="text-xs text-zinc-400">
                © {new Date().getFullYear()} {page.footer}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-400 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-400 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
              >
                <GithubIcon size={18} />
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
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-indigo-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon size={18} />
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

function ArrowUpIcon({ size = 18, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </Icon>
  );
}

function ArrowRightIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
    </Icon>
  );
}

function ChevronDownIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

function GithubIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.37 22c.58.1.8-.25.8-.56v-2c-3.26.7-3.95-1.4-3.95-1.4-.54-1.38-1.31-1.75-1.31-1.75-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.06 1.82 2.78 1.29 3.46.98.11-.77.42-1.29.76-1.59-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.76.82 1.22 1.87 1.22 3.15 0 4.51-2.74 5.5-5.35 5.79.43.37.81 1.1.81 2.22v3.28c0 .31.21.67.81.56A11.5 11.5 0 0 0 12 .5z" />
    </Icon>
  );
}

function LinkedinIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.55v6.19zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </Icon>
  );
}

function GlobeIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}

function CodeIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </Icon>
  );
}

function FolderIcon({ size = 16, className = "", ...props }: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  );
}