import { useEffect, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";

const content = {
  es: {
    backButton: "Volver atrás",
    badge: "Full-stack Developer",
    title: "Jose Ángel Quinto",
    subtitle: "Junior Full-Stack con foco en React",
    intro:
      "1 año de experiencia desarrollando aplicaciones empresariales en entornos profesionales. Especializado en React y backend con .NET.",
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
      "Una selección de demos y proyectos donde muestro estructura, componentes reutilizables e interfaces conectadas a datos mock o APIs.",
    projects: [
      {
        id: "portfolio-demo",
        title: "Portfolio Demo",
        description:
          "Aplicación demo con módulos interactivos de operaciones y analítica. Incluye navegación interna, componentes reutilizables, tipado con TypeScript y servicios mock.",
        href: "/portfolio-demo",
        cta: "Ver demo",
        tags: ["React", "TypeScript", "Tailwind", "Mock API"],
      },
    ],
    footer: "Jose Ángel Quinto Ferrández · Portafolio",
  },
  en: {
    backButton: "Go back",
    badge: "Full-stack Developer",
    title: "Jose Ángel Quinto",
    subtitle: "Junior Full-Stack focused on React",
    intro:
      "1 year of experience building enterprise applications in professional environments. Specialized in React and backend with .NET.",
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
    projectsSubtitle:
      "A selection of demos and projects where I showcase structure, reusable components and interfaces connected to mock data or APIs.",
    projects: [
      {
        id: "portfolio-demo",
        title: "Portfolio Demo",
        description:
          "Demo application with interactive operations and analytics modules. Includes internal navigation, reusable components, TypeScript typing and mock services.",
        href: "/portfolio-demo",
        cta: "View demo",
        tags: ["React", "TypeScript", "Tailwind", "Mock API"],
      },
    ],
    footer: "Jose Ángel Quinto Ferrández · Portfolio",
  },
} as const;

type Language = keyof typeof content;

export default function ProjectsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const tmr = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(tmr);
  }, []);

  const t = content[language];

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 ..."
          >
            <ArrowLeftIcon size={16} className="transition-transform group-hover:-translate-x-0.5" />
            {t.backButton}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage((lang) => (lang === "es" ? "en" : "es"))}
              aria-label="Cambiar idioma"
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-600"
            >
              <GlobeIcon size={16} />
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
          <div className="absolute -top-32 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="absolute top-24 left-12 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10" />
          <div className="absolute top-40 right-12 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-500/10" />
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(113 113 122) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
            <div className="max-w-3xl">
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-indigo-900 ring-1 ring-inset ring-indigo-200/50 transition-all duration-300 dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-100 dark:ring-indigo-500/30 ${mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                style={{ transitionDelay: "100ms" }}
              >
                <SparkleIcon size={14} className="animate-pulse" />
                {t.badge}
              </div>

              <h1
                className={`text-4xl font-black tracking-tight text-zinc-900 transition-all duration-500 sm:text-6xl lg:text-7xl dark:text-white ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: "200ms" }}
              >
                {t.title}
              </h1>

              <p
                className={`mt-4 text-xl font-semibold text-zinc-700 transition-all duration-500 sm:text-2xl dark:text-zinc-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: "250ms" }}
              >
                {t.subtitle}
              </p>

              <p
                className={`mt-4 text-base leading-relaxed text-zinc-600 transition-all duration-500 sm:text-lg dark:text-zinc-400 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: "300ms" }}
              >
                {t.intro}
              </p>

              <div
                className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
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

              <div
                className={`mt-8 flex flex-wrap gap-2.5 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
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

          <div className="h-16 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />
        </div>
      </header>

      <section id="about" className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              {t.aboutTitle}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {t.experience.map((item, index) => (
              <article
                key={index}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-2xl dark:hover:shadow-black/20"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                  <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-2 dark:from-indigo-500/20 dark:to-purple-500/20">
                    <CodeIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {t.projects.map((project, index) => (
              <article
                key={project.id}
                className={`group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-2xl dark:hover:shadow-black/20 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: `${550 + index * 100}ms` }}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3 dark:from-indigo-500/20 dark:to-purple-500/20">
                    <FolderIcon size={22} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to={project.href}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {project.cta}
                    <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BackToTop />

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
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/30 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
    >
      <ArrowUpIcon size={20} />
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

function ArrowRightIcon({
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
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
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