import { useEffect, useState } from "react";
import type { ReactNode, SVGProps } from "react";

// Proyectos comentados temporalmente - se añadirán próximamente
/*
const PROJECTS = [
  {
    id: 1,
    title: "Proyecto 1",
    description: "Landing page minimalista y responsive. | BOOTSTRAP | CSS | HTML |",
    image: "/img/zoo1.png",
    href: "/Proyectos/LandingPageBoostrap/index.html",
  },
  {
    id: 2,
    title: "Proyecto 2",
    description: "Proyecto de página web de restaurante. | HTML | CSS | JS |",
    image: "/img/restaur1.png",
    href: "/Proyectos/LaDolceTavolaRestaurante/DolceTavolaHome.html",
  },
];
*/

const content = {
  es: {
    backButton: "Volver atrás",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    badge: "Full-stack Developer",
    title: "Jose Ángel Quinto",
    subtitle: "Junior Full-Stack con foco en React",
    intro:
      "9 meses de experiencia desarrollando aplicaciones empresariales en entornos profesionales. Especializado en React y backend con .NET.",
    viewProjects: "Ver proyectos",
    aboutTitle: "Sobre mí",
    experience: [
      {
        title: "Experiencia Actual",
        description:
          "Trabajo en una consultora tecnológica desarrollando aplicaciones empresariales (ERP, SGA y MES). Participo en todo el ciclo: desde el diseño de base de datos hasta la interfaz de usuario.",
      },
      {
        title: "Stack Frontend",
        description:
          "React con hooks, Context API, TypeScript y Tailwind. Desarrollo componentes complejos como modales, tablas dinámicas y formularios, conectando con APIs REST propias.",
      },
      {
        title: "Stack Backend",
        description:
          ".NET con Entity Framework, PostgreSQL (joins, migraciones), DTOs y validaciones de negocio. Experiencia en diseño de endpoints REST y flujos de autenticación.",
      },
      {
        title: "Enfoque Profesional",
        description:
          "Busco un rol junior/early-mid centrado en React, con oportunidades para crecer en backend y arquitectura. Me adapto rápido a nuevas tecnologías y entornos de negocio.",
      },
    ],
    projectsTitle: "Proyectos",
    projectsSubtitle:
      "Próximamente publicaré aquí una selección de proyectos personales y profesionales.",
    projectsPlaceholder:
      "Estoy preparando algunos proyectos para mostrar aquí. Vuelve pronto para verlos.",
    footer: "Jose Ángel Quinto Ferrández · Portafolio",
  },
  en: {
    backButton: "Go back",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    badge: "Full-stack Developer",
    title: "Jose Ángel Quinto",
    subtitle: "Junior Full-Stack focused on React",
    intro:
      "9 months of experience building enterprise applications in professional environments. Specialized in React and backend with .NET.",
    viewProjects: "View projects",
    aboutTitle: "About me",
    experience: [
      {
        title: "Current Experience",
        description:
          "Working at a technology consultancy developing enterprise applications (ERP, WMS and MES). I participate in the full cycle: from database design to user interfaces.",
      },
      {
        title: "Frontend Stack",
        description:
          "React with hooks, Context API, TypeScript and Tailwind. Building complex components like modals, dynamic tables and forms, connecting to in-house REST APIs.",
      },
      {
        title: "Backend Stack",
        description:
          ".NET with Entity Framework, PostgreSQL (joins, migrations), DTOs and business validations. Experience designing REST endpoints and authentication flows.",
      },
      {
        title: "Professional Focus",
        description:
          "Looking for a junior/early-mid role focused on React, with opportunities to grow in backend and architecture. I adapt quickly to new technologies and business environments.",
      },
    ],
    projectsTitle: "Projects",
    projectsSubtitle: "Coming soon: a selection of personal and professional projects.",
    projectsPlaceholder: "I'm preparing some projects to showcase here. Check back soon!",
    footer: "Jose Ángel Quinto Ferrández · Portfolio",
  },
} as const;

type Language = keyof typeof content;

export default function ProjectsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });

  const [mounted, setMounted] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", String(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    const tmr = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(tmr);
  }, []);

  const t = content[language];

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a
            href="/index.html"
            className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:focus-visible:ring-zinc-600"
          >
            <ArrowLeftIcon size={16} className="transition-transform group-hover:-translate-x-0.5" />
            {t.backButton}
          </a>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage((lang) => (lang === "es" ? "en" : "es"))}
              aria-label="Cambiar idioma"
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-600"
            >
              <GlobeIcon size={16} />
              {language === "es" ? "EN" : "ES"}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((v) => !v)}
              aria-pressed={darkMode}
              aria-label="Alternar modo oscuro"
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-600"
            >
              <span className="transition-transform duration-300 hover:rotate-12">
                {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </span>
              {darkMode ? t.lightMode : t.darkMode}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background with gradients and effects */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

          {/* Ambient light halos */}
          <div className="absolute -top-32 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="absolute top-24 left-12 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10" />
          <div className="absolute top-40 right-12 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-500/10" />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(113 113 122) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
            <div className="max-w-3xl">
              {/* Badge */}
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-indigo-900 ring-1 ring-inset ring-indigo-200/50 transition-all duration-300 dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-100 dark:ring-indigo-500/30 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <SparkleIcon size={14} className="animate-pulse" />
                {t.badge}
              </div>

              {/* Title */}
              <h1
                className={`text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                {t.title}
              </h1>

              {/* Subtitle */}
              <p
                className={`mt-4 text-xl font-semibold text-zinc-700 sm:text-2xl dark:text-zinc-200 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "250ms" }}
              >
                {t.subtitle}
              </p>

              {/* Description */}
              <p
                className={`mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                {t.intro}
              </p>

              {/* CTA Buttons */}
              <div
                className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:from-white dark:to-zinc-100 dark:text-zinc-900 dark:shadow-white/10 dark:hover:shadow-white/20"
                >
                  {t.aboutTitle}
                  <ChevronDownIcon size={16} />
                </a>

                <a
                  href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  <LinkedinIcon size={16} />
                  LinkedIn
                </a>

                <a
                  href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
              </div>

              {/* Tech Stack Chips */}
              <div
                className={`mt-8 flex flex-wrap gap-2.5 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {["React", "TypeScript", "Tailwind", ".NET", "PostgreSQL", "Entity Framework"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-700"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom gradient separator */}
          <div className="h-16 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              {t.aboutTitle}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {t.experience.map(
              (item: (typeof t.experience)[number], index: number) => (
                <article
                  key={index}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-2xl dark:hover:shadow-black/20"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </h3>
                    <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-2 dark:from-indigo-500/20 dark:to-purple-500/20">
                      <CodeIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* Projects Section - Placeholder */}
      <section id="projects" className="bg-zinc-50 py-20 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              {t.projectsTitle}
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              {t.projectsSubtitle}
            </p>
          </div>

          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white/50 p-16 dark:border-zinc-700 dark:bg-zinc-900/50">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
                <FolderIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                {t.projectsPlaceholder}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-left">
              © {new Date().getFullYear()} {t.footer}
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                <GithubIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BackToTop() {
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
      aria-label="Volver arriba"
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/30 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
}

/* ---------- Icon Components ---------- */

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

function ArrowLeftIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  );
}

function ArrowUpIcon({
  size = 20,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

function ChevronDownIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

function MoonIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z" />
    </Icon>
  );
}

function SunIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </Icon>
  );
}

function SparkleIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
    </Icon>
  );
}

function GithubIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.37 22c.58.1.8-.25.8-.56v-2c-3.26.7-3.95-1.4-3.95-1.4-.54-1.38-1.31-1.75-1.31-1.75-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.06 1.82 2.78 1.29 3.46.98.11-.77.42-1.29.76-1.59-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.76.82 1.22 1.87 1.22 3.15 0 4.51-2.74 5.5-5.35 5.79.43.37.81 1.1.81 2.22v3.28c0 .31.21.67.81.56A11.5 11.5 0 0 0 12 .5z" />
    </Icon>
  );
}

function LinkedinIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.55v6.19zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </Icon>
  );
}

function GlobeIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}

function CodeIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </Icon>
  );
}

function FolderIcon({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  );
}


// import { useEffect, useMemo, useState } from "react";

// const PROJECTS = [
//   {
//     id: 1,
//     title: "Proyecto 1",
//     description: "Landing page minimalista y responsive. | BOOTSTRAP | CSS | HTML |",
//     image: "/img/zoo1.png",
//     href: "/Proyectos/LandingPageBoostrap/index.html",
//   },
//   {
//     id: 2,
//     title: "Proyecto 2",
//     description: "Proyecto de página web de restaurante. | HTML | CSS | JS |",
//     image: "/img/restaur1.png",
//     href: "/Proyectos/LaDolceTavolaRestaurante/DolceTavolaHome.html",
//   },
//   {
//     id: 3,
//     title: "Proyecto 3",
//     description: "Próximo proyecto | ? |",
//     image: "/img/prox.jpg",
//     href: "",
//     disabled: true,
//   },
// ];

// export default function ProjectsPage() {
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem("darkMode");
//       return saved === "true";
//     }
//     return false;
//   });
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     if (typeof window !== 'undefined') {
//       localStorage.setItem("darkMode", String(darkMode));
//     }
//   }, [darkMode]);

//   useEffect(() => {
//     const t = window.setTimeout(() => setMounted(true), 40);
//     return () => window.clearTimeout(t);
//   }, []);

//   const projects = useMemo(() => PROJECTS, []);

//   return (
//     <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">

//       {/* Top Navigation Bar */}
//       <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/80">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
//           <a 
//             href="/index.html" 
//             className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:focus-visible:ring-zinc-600"
//           >
//             <ArrowLeftIcon size={16} className="transition-transform group-hover:-translate-x-0.5" />
//             Volver atrás
//           </a>

//           <button
//             onClick={() => setDarkMode((v) => !v)}
//             aria-pressed={darkMode}
//             aria-label="Alternar modo oscuro"
//             type="button"
//             className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-600"
//           >
//             <span className="transition-transform duration-300 hover:rotate-12">
//               {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
//             </span>
//             {darkMode ? "Modo Claro" : "Modo Oscuro"}
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <header className="relative overflow-hidden">
//         {/* Background with gradients and effects */}
//         <div className="absolute inset-0">
//           <div className="h-full w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

//           {/* Ambient light halos */}
//           <div className="absolute -top-32 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
//           <div className="absolute top-24 left-12 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10" />
//           <div className="absolute top-40 right-12 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-500/10" />

//           {/* Subtle dot pattern */}
//           <div
//             className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at 1px 1px, rgb(113 113 122) 1px, transparent 0)",
//               backgroundSize: "20px 20px",
//             }}
//           />
//         </div>

//         {/* Content */}
//         <div className="relative">
//           <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
//             <div className="max-w-3xl">
//               {/* Badge */}
//               <div 
//                 className={`mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-indigo-900 ring-1 ring-inset ring-indigo-200/50 transition-all duration-300 dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-100 dark:ring-indigo-500/30 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
//                 style={{ transitionDelay: '100ms' }}
//               >
//                 <SparkleIcon size={14} className="animate-pulse" />
//                 Full-stack Developer
//               </div>

//               {/* Title */}
//               <h1 
//                 className={`text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//                 style={{ transitionDelay: '200ms' }}
//               >
//                 Portafolio de{" "}
//                 <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
//                   Jose
//                 </span>
//               </h1>

//               {/* Description */}
//               <p 
//                 className={`mt-6 text-base leading-relaxed text-zinc-600 sm:text-lg lg:text-xl dark:text-zinc-300 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//                 style={{ transitionDelay: '300ms' }}
//               >
//                 Proyectos centrados en UI limpia, responsive y detalles. Código simple, resultado profesional.
//               </p>

//               {/* CTA Buttons */}
//               <div 
//                 className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//                 style={{ transitionDelay: '400ms' }}
//               >
//                 <a
//                   href="#projects"
//                   className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:from-white dark:to-zinc-100 dark:text-zinc-900 dark:shadow-white/10 dark:hover:shadow-white/20"
//                 >
//                   Ver proyectos
//                   <ChevronDownIcon size={16} />
//                 </a>

//                 <a
//                   href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
//                 >
//                   <LinkedinIcon size={16} />
//                   LinkedIn
//                 </a>

//                 <a
//                   href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
//                 >
//                   <GithubIcon size={16} />
//                   GitHub
//                 </a>
//               </div>

//               {/* Tech Stack Chips */}
//               <div 
//                 className={`mt-8 flex flex-wrap gap-2.5 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//                 style={{ transitionDelay: '500ms' }}
//               >
//                 {["React", "TypeScript", "Tailwind", "PostgreSQL", ".NET"].map((tech) => (
//                   <span
//                     key={tech}
//                     className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-700"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Bottom gradient separator */}
//           <div className="h-16 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
//         </div>
//       </header>

//       {/* Projects Section */}
//       <main id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
//         <div className="mb-10">
//           <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
//             Mis Proyectos
//           </h2>
//           <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
//             Selección corta y cuidada. Abre cada proyecto en una pestaña.
//           </p>
//         </div>

//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {projects.map((project, index) => (
//             <article
//               key={project.id}
//               className={`group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-black/20 ${
//                 mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//               }`}
//               style={{
//                 transitionDelay: `${index * 100}ms`,
//               }}
//             >
//               {/* Image Container */}
//               <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
//                 <img
//                   src={project.image}
//                   alt={project.title}
//                   className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                   loading="lazy"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
//                   {project.title}
//                 </h3>

//                 <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
//                   {project.description}
//                 </p>

//                 <div className="mt-6">
//                   {project.disabled ? (
//                     <button
//                       disabled
//                       type="button"
//                       className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
//                     >
//                       Próximamente
//                     </button>
//                   ) : (
//                     <a
//                       href={project.href}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-900 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
//                     >
//                       Ver más
//                       <ExternalLinkIcon size={16} />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </main>

//       {/* Back to Top Button */}
//       <BackToTop />

//       {/* Footer */}
//       <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
//         <div className="mx-auto max-w-6xl px-4 sm:px-6">
//           <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
//             <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-left">
//               © {new Date().getFullYear()} Jose Ángel Quinto Ferrández · Portafolio · Todos los derechos reservados.
//             </p>

//             <div className="flex items-center gap-3">
//               <a
//                 href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
//                 aria-label="LinkedIn"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
//               >
//                 <LinkedinIcon size={20} />
//               </a>
//               <a
//                 href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
//                 aria-label="GitHub"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
//               >
//                 <GithubIcon size={20} />
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function BackToTop() {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 400);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <button
//       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//       type="button"
//       aria-label="Volver arriba"
//       className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/30 ${
//         show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
//       }`}
//     >
//       <ArrowUpIcon size={20} />
//     </button>
//   );
// }

// /* ---------- Icon Components ---------- */
// import type { ReactNode, SVGProps } from "react";

// type IconProps = SVGProps<SVGSVGElement> & {
//   size?: number;
//   viewBox?: string;
//   className?: string;
//   children?: ReactNode;
// };

// function Icon({
//   size = 16,
//   viewBox = "0 0 24 24",
//   className = "",
//   children,
//   ...props
// }: IconProps) {
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox={viewBox}
//       className={className}
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       {...props}
//     >
//       {children}
//     </svg>
//   );
// }

// function ArrowLeftIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M15 18l-6-6 6-6" />
//     </Icon>
//   );
// }

// function ArrowUpIcon({ size = 20, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M12 19V5" />
//       <path d="M5 12l7-7 7 7" />
//     </Icon>
//   );
// }

// function ExternalLinkIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M14 3h7v7" />
//       <path d="M10 14L21 3" />
//       <path d="M21 14v7H3V3h7" />
//     </Icon>
//   );
// }

// function ChevronDownIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M6 9l6 6 6-6" />
//     </Icon>
//   );
// }

// function MoonIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z" />
//     </Icon>
//   );
// }

// function SunIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <circle cx="12" cy="12" r="4" />
//       <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
//     </Icon>
//   );
// }

// function SparkleIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//       <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
//     </Icon>
//   );
// }

// function GithubIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
//       <path d="M12 .5A11.5 11.5 0 0 0 8.37 22c.58.1.8-.25.8-.56v-2c-3.26.7-3.95-1.4-3.95-1.4-.54-1.38-1.31-1.75-1.31-1.75-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.06 1.82 2.78 1.29 3.46.98.11-.77.42-1.29.76-1.59-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.76.82 1.22 1.87 1.22 3.15 0 4.51-2.74 5.5-5.35 5.79.43.37.81 1.1.81 2.22v3.28c0 .31.21.67.81.56A11.5 11.5 0 0 0 12 .5z" />
//     </Icon>
//   );
// }

// function LinkedinIcon({ size = 16, className = "", ...props }) {
//   return (
//     <Icon size={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
//       <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.55v6.19zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
//     </Icon>
//   );
// }