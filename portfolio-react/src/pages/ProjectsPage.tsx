import { useEffect, useMemo, useState } from "react";

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
  {
    id: 3,
    title: "Proyecto 3",
    description: "Próximo proyecto | ? |",
    image: "/img/prox.jpg",
    href: "",
    disabled: true,
  },
];

export default function ProjectsPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  const projects = useMemo(() => PROJECTS, []);

  const topLinkClass = darkMode
    ? "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-100/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    : "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300";

  const topToggleClass = darkMode
    ? "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
    : "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300";

  return (
<div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

      {/* Top bar */}
     <div className="sticky top-0 z-50 border-b border-zinc-200/60 bg-zinc-100/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/70">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/index.html" className={topLinkClass}>
            <ArrowLeftIcon size={16} />
            Volver atrás
          </a>

          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-pressed={darkMode}
            aria-label="Alternar modo oscuro"
            type="button"
            className={topToggleClass}
          >
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            {darkMode ? "Claro" : "Oscuro"}
          </button>
        </div>
      </div>

      {/* Hero (gradient clean, sin imagen) */}
      {/* Hero (gradient clean, sin imagen) */}
<header className="relative overflow-hidden">
  {/* Fondo */}
  <div className="absolute inset-0">
    <div className="h-full w-full bg-gradient-to-b from-zinc-100 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950" />


    {/* halos */}
    <div className="absolute -top-24 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
    <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
    <div className="absolute top-32 right-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

    {/* patrón sutil */}
    <div
      className="absolute inset-0 opacity-[0.10]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,.35) 1px, transparent 0)",
        backgroundSize: "18px 18px",
      }}
    />
  </div>

  {/* Contenido */}
  <div className="relative">
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="max-w-2xl">
        {/* Badge */}
        <p className="
          mb-4 inline-flex items-center gap-2 rounded-full
          bg-zinc-900/5 px-3 py-1 text-xs font-semibold text-zinc-800
          ring-1 ring-zinc-300
          dark:bg-white/10 dark:text-white dark:ring-white/15
        ">
          <SparkleIcon size={16} />
          Full-stack developer
        </p>

        {/* Título */}
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          Portafolio de Jose
        </h1>

        {/* Descripción */}
        <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-white/80">
          Proyectos centrados en UI limpia, responsive y detalles. Código simple, resultado profesional.
        </p>

        {/* Botones */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
           className="inline-flex items-center gap-2 rounded-2xl bg-zinc-50 px-5 py-2.5 text-sm font-extrabold text-zinc-900 shadow-sm hover:shadow"

          >
            Ver proyectos
            <ChevronDownIcon size={16} />
          </a>

          <a
            href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold
              border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50
              dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15
            "
          >
            <LinkedinIcon size={16} />
            LinkedIn
          </a>

          <a
            href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold
              border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50
              dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15
            "
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </div>

        {/* Chips */}
        <div className="mt-7 flex flex-wrap gap-2">
          {["React", "TypeScript", "Tailwind", "PostgreSQL", ".NET"].map((t) => (
            <span
              key={t}
              className="
                rounded-full px-3 py-1 text-xs font-semibold
                bg-zinc-900/5 text-zinc-800 ring-1 ring-zinc-300
                dark:bg-white/10 dark:text-white/90 dark:ring-white/10
              "
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* separador */}
    <div className="h-12 bg-gradient-to-b from-transparent to-zinc-100 dark:to-zinc-950" />

  </div>
</header>


      {/* Content */}
      <main id="projects" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Mis Proyectos</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Selección corta y cuidada. Abre cada proyecto en una pestaña.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={[
                "group overflow-hidden rounded-2xl border border-zinc-200  shadow-sm",
                "transition hover:-translate-y-1 hover:shadow-lg",
                "dark:border-zinc-700 dark:bg-zinc-800 dark:ring-1 dark:ring-white/10",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
              style={{
                transitionDelay: `${i * 110}ms`,
                transitionDuration: "450ms",
                transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)",
              }}
            >

              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {p.description}
                </p>

                <div className="mt-5">
                  {p.disabled ? (
                    <button
                      disabled
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-200 px-4 py-2 text-sm font-extrabold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                    >
                      Próximamente
                    </button>
                  ) : (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
    inline-flex w-full items-center justify-center gap-2
    rounded-xl px-4 py-2 text-sm font-semibold
    border border-zinc-200
    bg-white text-zinc-900
    shadow-sm transition-all duration-200
    hover:bg-zinc-50 hover:shadow-md
    active:scale-[0.98]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2

    dark:border-zinc-700
    dark:bg-zinc-900 dark:text-zinc-100
    dark:hover:bg-zinc-800
    dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950
  "
                    >
                      Ver más
                      <ExternalLinkIcon size={16} />
                    </a>

                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BackToTop />

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 py-10 dark:border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © Jose Ángel Quinto Ferrández | Portafolio 2025 | Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-700 shadow-sm hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-700 shadow-sm hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      type="button"
      aria-label="Volver arriba"
      className={[
        "fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-2xl",
        "border border-zinc-200 bg-white p-3 text-zinc-800 shadow-lg transition",
        "hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
      ].join(" ")}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
}

/* ---------- Icon helper ---------- */
import type { ReactNode, SVGProps } from "react";

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


/* ---------- Icons ---------- */
function ArrowLeftIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  );
}
function ArrowUpIcon({ size = 20, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </Icon>
  );
}
function ExternalLinkIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v7H3V3h7" />
    </Icon>
  );
}
function ChevronDownIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}
function MoonIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z" />
    </Icon>
  );
}
function SunIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </Icon>
  );
}
function SparkleIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
    </Icon>
  );
}
function GithubIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.37 22c.58.1.8-.25.8-.56v-2c-3.26.7-3.95-1.4-3.95-1.4-.54-1.38-1.31-1.75-1.31-1.75-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.06 1.82 2.78 1.29 3.46.98.11-.77.42-1.29.76-1.59-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.76.82 1.22 1.87 1.22 3.15 0 4.51-2.74 5.5-5.35 5.79.43.37.81 1.1.81 2.22v3.28c0 .31.21.67.81.56A11.5 11.5 0 0 0 12 .5z" />
    </Icon>
  );
}
function LinkedinIcon({ size = 16, ...props }) {
  return (
    <Icon size={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.55v6.19zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </Icon>
  );
}
