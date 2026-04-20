import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";

const editorialFont = "'Georgia', 'Times New Roman', serif";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Project = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  cta: string;
};

type ProjectsPageText = {
  projectFootnote: string;
  projectMetaLabel: string;
  projectMetaSubLabel: string;
  projectYear: string;
  projectSideDescription: string;
};

// ── Hook: parallax offset from scroll ─────────────────────────────────────
function useParallax(speed = 0.08) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return offset;
}

// ── FadeUp ─────────────────────────────────────────────────────────────────
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(3px)" }}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Magnetic button wrapper ────────────────────────────────────────────────
function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setDelta({
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => setDelta({ x: 0, y: 0 }), []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `translate(${delta.x}px, ${delta.y}px)`,
        transition:
          delta.x === 0 && delta.y === 0
            ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)"
            : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  page,
  focusOnWhite,
}: {
  project: Project;
  index: number;
  page: ProjectsPageText;
  focusOnWhite: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px 0px" });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const numY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const cardY = useTransform(scrollYProgress, [0, 0.3, 1], [40, 0, -10]);
  const smoothCardY = useSpring(cardY, { stiffness: 60, damping: 18 });

  return (
    <motion.div
      ref={cardRef}
      style={{ y: smoothCardY }}
      initial={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
      animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{
        duration: 1,
        delay: index * 0.13,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[30px]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.6, 0] } : {}}
        transition={{
          duration: 1.8,
          delay: index * 0.13 + 0.3,
          ease: "easeOut",
        }}
        style={{
          boxShadow: "0 0 60px 10px rgba(180,168,154,0.18)",
          borderRadius: "30px",
        }}
      />

      <SpotlightCard className="group relative overflow-hidden rounded-[30px] border border-[#e5dfd6] bg-white/88 backdrop-blur-sm transition-[box-shadow,border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#cfc6ba] hover:bg-white hover:shadow-[0_32px_80px_rgba(0,0,0,0.09)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8d0c5] to-transparent opacity-90" />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          initial={{ x: "-110%", skewX: "-8deg", opacity: 0 }}
          whileHover={{ x: "110%", opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "linear-gradient(100deg, transparent 20%, rgba(220,208,190,0.22) 50%, transparent 80%)",
            zIndex: 1,
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            zIndex: 1,
          }}
        />

        <div className="relative z-10 flex h-full flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-7 flex items-center gap-4">
              <motion.span
                className="text-[0.95rem] leading-none text-[#c1b8ac] tabular-nums"
                style={{ fontFamily: editorialFont, y: numY }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>

              <div className="relative h-px w-10 overflow-hidden bg-[#ddd5cb]">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-[#9e968c]"
                  initial={{ width: "0%" }}
                  animate={isInView ? { width: "100%" } : { width: "0%" }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.13 + 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>

            <div className="max-w-3xl">
              <div className="overflow-hidden">
                <motion.h3
                  className="text-[1.55rem] font-normal leading-[1.14] tracking-[-0.012em] text-[#161616] transition-colors duration-300 group-hover:text-[#000]"
                  style={{ fontFamily: editorialFont }}
                  initial={{ y: "105%", rotate: 1.5 }}
                  animate={isInView ? { y: "0%", rotate: 0 } : {}}
                  transition={{
                    duration: 0.85,
                    delay: index * 0.13 + 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {project.title}
                </motion.h3>
              </div>

              <motion.p
                className="mt-4 max-w-[64ch] text-[13px] leading-[1.98] text-[#6b655f]"
                style={{ fontFamily: editorialFont }}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.13 + 0.3,
                  ease: "easeOut",
                }}
              >
                {project.description}
              </motion.p>
            </div>

            <motion.div
              className="mt-7 flex flex-wrap gap-2.5"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: index * 0.13 + 0.4,
                  },
                },
                hidden: {},
              }}
            >
              {project.tags.map((tag) => (
                <motion.span
                  key={tag}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 8 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 20 },
                  }}
                  className="inline-flex cursor-default items-center rounded-full border border-[#e7e0d7] bg-[#fbfaf7] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#79736b]"
                  style={{ fontFamily: editorialFont }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 hidden sm:flex sm:items-center sm:gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.13 + 0.6 }}
            >
              <div className="relative h-px w-12 overflow-hidden bg-[#e4ddd4]">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-[#cfc6ba]"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <motion.span
                className="text-[10px] uppercase tracking-[0.18em] text-[#958e84] opacity-75"
                style={{ fontFamily: editorialFont }}
                whileHover={{ x: 4, opacity: 1, color: "#6f685f" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {page.projectFootnote}
              </motion.span>
            </motion.div>
          </div>

          <motion.div
            className="relative flex w-full flex-col justify-between gap-8 lg:w-[220px] lg:self-stretch lg:pl-8"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.13 + 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="absolute bottom-0 left-0 top-0 hidden w-px overflow-hidden bg-[#eee8df] lg:block">
              <motion.span
                className="absolute inset-x-0 top-0 bg-[#d0c8bf]"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                transition={{
                  duration: 1.1,
                  delay: index * 0.13 + 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
              />
            </div>

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

              <motion.span
                className="rounded-full border border-[#ece6dd] bg-[#faf8f4] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#978f86]"
                style={{ fontFamily: editorialFont }}
                whileHover={{
                  borderColor: "#c4b9ac",
                  backgroundColor: "#fff",
                  y: -2,
                  transition: { type: "spring", stiffness: 350, damping: 22 },
                }}
              >
                {page.projectYear}
              </motion.span>
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

              <motion.div
                className="self-start lg:self-end"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <Link
                  to={project.href}
                  className={cx(
                    "group/btn inline-flex items-center gap-2.5 rounded-full border border-[#cfc5b9] bg-[#f9f7f4] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#302c28] transition-all duration-300 hover:border-[#c3b9ad] hover:bg-[#f3eee7] hover:text-[#2a2622] hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)]",
                    focusOnWhite
                  )}
                  style={{ fontFamily: editorialFont }}
                >
                  <span>{project.cta}</span>
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
                    →
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-0 h-[1.5px] origin-center bg-gradient-to-r from-transparent via-[#b8ae9f] to-transparent"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </SpotlightCard>
    </motion.div>
  );
}

// ── Spotlight card effect ──────────────────────────────────────────────────
function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 1,
          background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, rgba(210,190,165,0.18), transparent 65%)`,
          opacity: spotlight.opacity,
          transition: "opacity 0.3s ease",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

// ── Floating particles ────────────────────────────────────────────────────
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.91) * 43758.5453123;
  return x - Math.floor(x);
}

function FloatingParticles() {
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const xRand = pseudoRandom(i + 1);
        const yRand = pseudoRandom(i + 101);
        const sizeRand = pseudoRandom(i + 201);
        const durRand = pseudoRandom(i + 301);
        const delayRand = pseudoRandom(i + 401);
        const opacityRand = pseudoRandom(i + 501);

        return {
          id: i,
          x: xRand * 100,
          y: yRand * 100,
          size: 1.5 + sizeRand * 2.5,
          dur: 6 + durRand * 10,
          delay: delayRand * 8,
          opacity: 0.12 + opacityRand * 0.25,
        };
      }),
    []
  );

  useEffect(() => {
    const updateBounds = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: -9999, y: -9999, active: false });
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {particles.map((p) => {
        const px = (p.x / 100) * bounds.width;
        const py = (p.y / 100) * bounds.height;

        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const influence = mouse.active ? Math.max(0, 1 - dist / 180) : 0;
        const pushX = dist > 0 ? (-dx / dist) * influence * 16 : 0;
        const pushY = dist > 0 ? (-dy / dist) * influence * 16 : 0;

        return (
          <motion.div
            key={p.id}
            animate={{
              x: pushX,
              y: pushY,
              opacity: p.opacity + influence * 0.16,
              scale: 1 + influence * 0.45,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
              mass: 0.6,
            }}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#9e968c",
              animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Stagger text reveal ───────────────────────────────────────────────────
function StaggerText({
  text,
  show,
  delay = 0,
}: {
  text: string;
  show: boolean;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.6s ease ${delay + i * 40}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay + i * 40}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

export default function ProjectsPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { language, toggleLanguage, t } = useLanguage();
  const parallaxOffset = useParallax(0.06);

  const page = t.projectsPage;
  const common = t.common;

  // de momento hasta meter las traducciones y demas
  const projects = useMemo(
    () => [
      ...page.projects,
      {
        id: "stock-system",
        title: "Stock System",
        description:
          "Sistema de stock con React, TypeScript y Supabase. Incluye filtros, tabla, alta, edición, borrado y configuración visual persistente.",
        tags: ["React", "TypeScript", "Supabase", "Stock"],
        href: "/stock-system",
        cta: language === "es" ? "Ver proyecto" : "View project",
      },
    ],
    [page.projects, language]
  );

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
          if (entry.isIntersecting) setActiveSection("hero");
        },
        { threshold: 0.35 }
      );

      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }

    ["about", "projects"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-18% 0px -58% 0px", threshold: 0.02 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
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

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0.08, 0.25], [0, 12]);
  const smoothHeroScale = useSpring(heroScale, { stiffness: 80, damping: 20 });

  return (
    <>
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-18px) rotate(180deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes scan-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          10%  { transform: translate(-2px,1px); }
          20%  { transform: translate(2px,-1px); }
          30%  { transform: translate(-1px,2px); }
          40%  { transform: translate(1px,-2px); }
          50%  { transform: translate(-2px,2px); }
          60%  { transform: translate(2px,1px); }
          70%  { transform: translate(-1px,-1px); }
          80%  { transform: translate(1px,2px); }
          90%  { transform: translate(-2px,-2px); }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #1a1a1a 0%, #1a1a1a 35%,
            #8a7f6e 45%, #cfc6ba 50%, #8a7f6e 55%,
            #1a1a1a 65%, #1a1a1a 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 8s linear infinite;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: currentColor;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-link-hover:hover::after,
        .nav-link-hover.active::after { width: 100%; }
      `}</style>

      <div
        className="min-h-screen overflow-x-hidden bg-[#f7f6f3] text-[#1a1a1a]"
        style={{ fontFamily: editorialFont }}
      >
        <div className="relative">
          <HeroInteractiveLayerSection />

          <nav
            className={cx(
              "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
              scrolled
                ? "bg-[#f7f6f3]/92 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                : "bg-[#f7f6f3]/94 backdrop-blur-sm"
            )}
          >
            <div className="mx-auto max-w-5xl px-6 sm:px-8">
              <div className="flex items-center justify-between py-5">
                <Magnetic strength={0.2}>
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={cx(
                      "group relative rounded-sm transition-colors duration-200 active:translate-y-[1px]",
                      focusOnWarm
                    )}
                  >
                    <span
                      className="shimmer-text text-sm font-normal uppercase tracking-[0.18em] text-[#1a1a1a]"
                      style={{ fontFamily: editorialFont }}
                    >
                      José Ángel Quinto
                    </span>
                  </button>
                </Magnetic>

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
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            })
                        }
                        className={cx(
                          "nav-link-hover group relative rounded-sm pb-1 text-xs uppercase tracking-[0.14em] transition-[color,transform] duration-200 active:translate-y-[1px]",
                          isActive
                            ? "active text-[#1a1a1a]"
                            : "text-[#8a847c] hover:text-[#1a1a1a]",
                          focusOnWarm
                        )}
                        style={{ fontFamily: editorialFont }}
                      >
                        {link.label}
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

          <motion.header
            ref={heroRef}
            style={{
              scale: smoothHeroScale,
              opacity: heroOpacity,
              filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
            }}
            className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-[#f7f6f3]"
          >
            <FloatingParticles />

            <div
              className="pointer-events-none absolute inset-0"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
              <div className="absolute left-1/2 top-0 h-40 w-px bg-gradient-to-b from-transparent to-[#ccc7bf]" />
              <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-gradient-to-t from-[#f1eee8]/55 via-transparent to-transparent" />
              <div
                className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-[#efe9df] opacity-40 blur-3xl"
                style={{
                  animation: "float 12s ease-in-out infinite alternate",
                }}
              />
              <div
                className="absolute -left-16 bottom-32 h-48 w-48 rounded-full bg-[#e8e2d8] opacity-25 blur-2xl"
                style={{
                  animation: "float 9s ease-in-out 3s infinite alternate",
                }}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                animation: "grain 0.5s steps(1) infinite",
              }}
            />

            <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24 pt-36 sm:px-8">
              <FadeUp show={mounted} delay={80} y={12} className="mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-[#9f988e]" />
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] text-[#777068]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.badge}
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full bg-[#9f988e] opacity-75"
                      style={{
                        animation:
                          "pulse-ring 2s cubic-bezier(0,0,0.2,1) infinite",
                      }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9f988e]" />
                  </span>
                </div>
              </FadeUp>

              <FadeUp show={mounted} delay={180} y={22}>
                <h1
                  className="max-w-4xl text-[clamp(2.5rem,7vw,5.8rem)] font-normal leading-[1.03] tracking-[-0.03em] text-[#171717]"
                  style={{ fontFamily: editorialFont }}
                >
                  <StaggerText
                    text={page.title}
                    show={mounted}
                    delay={200}
                  />
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
                    <SpotlightCard className="rounded-[22px] border border-[#e4dfd8] bg-white/50 px-5 py-5 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[#d4ccc1] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
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
                    </SpotlightCard>
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
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                    }
                    className={cx(
                      "group inline-flex items-center gap-2 rounded-sm border-b border-[#1a1a1a] pb-0.5 text-xs uppercase tracking-[0.14em] text-[#1a1a1a] transition-[color,border-color,transform] duration-200 hover:border-[#5d5750] hover:text-[#5d5750] active:translate-y-[1px]",
                      focusOnWarm
                    )}
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.projectsTitle}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
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

                  {[
                    {
                      href: "https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/",
                      label: "LinkedIn",
                    },
                    {
                      href: "https://github.com/JoseAQuinto/JoseAQuinto.github.io",
                      label: "GitHub",
                    },
                  ].map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx(
                        "rounded-sm border-b border-transparent pb-0.5 text-xs uppercase tracking-[0.14em] text-[#7e7870] transition-[color,border-color,transform] duration-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:translate-y-[1px]",
                        focusOnWarm
                      )}
                      style={{ fontFamily: editorialFont }}
                    >
                      {label}
                    </a>
                  ))}
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
                      {page.techStack.map((tech, i) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full border border-[#e3ddd4] bg-[#fbfaf8] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#746f69] transition-all duration-300 hover:border-[#c4bbb0] hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
                          style={{
                            fontFamily: editorialFont,
                            transitionDelay: `${i * 30}ms`,
                          }}
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
                "absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-1000",
                mounted ? "opacity-60" : "opacity-0"
              )}
              style={{ transitionDelay: "1400ms" }}
            >
              <span
                className="text-[9px] uppercase tracking-[0.22em] text-[#9e968c]"
                style={{ fontFamily: editorialFont }}
              >
                Scroll
              </span>
              <div className="relative h-10 w-px overflow-hidden bg-[#ddd7cf]">
                <div
                  className="absolute inset-x-0 top-0 h-1/2 bg-[#9e968c]"
                  style={{ animation: "scan-line 1.8s ease-in-out infinite" }}
                />
              </div>
            </div>
          </motion.header>
        </div>

        <section
          id="about"
          className="relative overflow-hidden scroll-mt-28 bg-white py-28"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(186,176,163,0.13) 0%, transparent 70%)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.span
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: "absolute",
                right: "-2rem",
                top: "2rem",
                fontFamily: editorialFont,
                fontSize: "clamp(8rem, 20vw, 18rem)",
                fontWeight: 400,
                lineHeight: 0.85,
                letterSpacing: "-0.06em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(170,160,148,0.13)",
                userSelect: "none",
              }}
            >
              {language === "es" ? "Sobre mí" : "About"}
            </motion.span>
          </div>

          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <div className="mb-20">
              <motion.div
                className="mb-6 flex items-center gap-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="h-px bg-[#999189]"
                  initial={{ width: 0 }}
                  whileInView={{ width: 24 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.22em] text-[#777068]"
                  style={{ fontFamily: editorialFont }}
                >
                  {page.aboutTitle}
                </span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.p
                  className="max-w-xl text-sm leading-[1.9] text-[#6d655f]"
                  style={{ fontFamily: editorialFont }}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                >
                  {page.aboutSectionNote}
                </motion.p>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-2">
              {page.experience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 60,
                    rotateX: 8,
                    filter: "blur(6px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, margin: "-40px 0px" }}
                  whileHover={{
                    y: -6,
                    transition: { type: "spring", stiffness: 350, damping: 28 },
                  }}
                  style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                >
                  <SpotlightCard className="group relative overflow-hidden border-t border-[#e8e4de] p-8 transition-[background-color,box-shadow] duration-500 hover:bg-[#fcfbf8] hover:shadow-[0_24px_64px_rgba(0,0,0,0.07)] first:border-t-0 md:first:border-t md:[&:nth-child(2)]:border-t-0 md:odd:border-r md:border-r-[#e8e4de]">
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(210,195,175,0.18) 50%, transparent 70%)",
                        zIndex: 0,
                      }}
                    />

                    <motion.div
                      className="absolute inset-x-0 top-0 h-[1.5px] origin-left bg-gradient-to-r from-transparent via-[#b8ae9f] to-transparent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />

                    <motion.div
                      className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        background:
                          "radial-gradient(circle, rgba(186,176,163,0.22) 0%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="mb-5 flex items-center gap-3">
                        <motion.span
                          className="text-[10px] tabular-nums tracking-[0.2em] text-[#b7b0a8]"
                          style={{ fontFamily: editorialFont }}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.3,
                            ease: "easeOut",
                          }}
                          viewport={{ once: true }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </motion.span>
                        <motion.div
                          className="h-px bg-[#e0d9d0]"
                          initial={{ width: 0 }}
                          whileInView={{ width: 20 }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.15 + 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          viewport={{ once: true }}
                        />
                      </div>

                      <div className="mb-3 overflow-hidden">
                        <motion.h3
                          className="max-w-[22ch] text-[1.04rem] font-normal leading-[1.5] text-[#171717] transition-colors duration-200 group-hover:text-[#000]"
                          style={{ fontFamily: editorialFont }}
                          initial={{ y: "100%", opacity: 0 }}
                          whileInView={{ y: "0%", opacity: 1 }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.15 + 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          viewport={{ once: true }}
                        >
                          {item.title}
                        </motion.h3>
                      </div>

                      <motion.p
                        className="max-w-[54ch] text-sm leading-[1.95] text-[#66615c]"
                        style={{ fontFamily: editorialFont }}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.7,
                          delay: index * 0.15 + 0.35,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      >
                        {item.description}
                      </motion.p>
                    </div>

                    <motion.div
                      className="pointer-events-none absolute bottom-0 right-0"
                      initial={{ width: 0, height: 0, opacity: 0 }}
                      whileHover={{ width: 56, height: 56, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        borderTop: "1px solid rgba(180,168,154,0.35)",
                        borderLeft: "1px solid rgba(180,168,154,0.35)",
                        borderRadius: "12px 0 0 0",
                      }}
                    />
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-20 h-px bg-gradient-to-r from-transparent via-[#ccc6be] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 1.3,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3,
              }}
              viewport={{ once: true }}
            />
          </div>
        </section>

        <section
          id="projects"
          className="relative overflow-hidden scroll-mt-28 bg-[#f7f6f3] py-32"
        >
          <motion.div
            className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(186,176,163,0.09) 0%, transparent 70%)",
            }}
          />

          <motion.div
            className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full"
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(160,152,142,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.span
              initial={{ x: -180, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                position: "absolute",
                left: "-1rem",
                bottom: "3rem",
                fontFamily: editorialFont,
                fontSize: "clamp(7rem, 18vw, 16rem)",
                fontWeight: 400,
                lineHeight: 0.85,
                letterSpacing: "-0.06em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(160,150,138,0.11)",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {language === "es" ? "Proyectos" : "Projects"}
            </motion.span>
          </div>

          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <motion.div
                  className="overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.span
                    className="inline-block text-[10px] uppercase tracking-[0.22em] text-[#8a8279]"
                    style={{ fontFamily: editorialFont }}
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                  >
                    {page.projectsEyebrow}
                  </motion.span>
                </motion.div>

                <div className="mt-3 overflow-hidden">
                  <motion.h2
                    className="text-[clamp(1.9rem,4vw,3.25rem)] font-normal leading-tight text-[#171717]"
                    style={{ fontFamily: editorialFont }}
                    initial={{ y: "100%" }}
                    whileInView={{ y: "0%" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    viewport={{ once: true }}
                  >
                    {page.projectsTitle}
                  </motion.h2>
                </div>

                <motion.div
                  className="mt-4 h-px bg-gradient-to-r from-[#b8ae9f] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{
                    duration: 1.1,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  style={{ maxWidth: "280px" }}
                />
              </div>

              <motion.p
                className="max-w-xl text-sm leading-[1.95] text-[#66615c]"
                style={{ fontFamily: editorialFont }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
              >
                {page.projectsSubtitle}
              </motion.p>
            </div>

            <div className="grid gap-5">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  page={page}
                  focusOnWhite={focusOnWhite}
                />
              ))}
            </div>

            <motion.div
              className="mt-24 flex items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ccc6be] to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
                viewport={{ once: true }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#a09890]"
                style={{ fontFamily: editorialFont }}
              >
                {new Date().getFullYear()}
              </span>
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ccc6be] to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
                viewport={{ once: true }}
              />
            </motion.div>
          </div>
        </section>

        <BackToTop ariaLabel={common.backToTop} />

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
                {[
                  {
                    href: "https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/",
                    label: "LinkedIn",
                  },
                  {
                    href: "https://github.com/JoseAQuinto/JoseAQuinto.github.io",
                    label: "GitHub",
                  },
                ].map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      "rounded-sm text-xs uppercase tracking-[0.14em] text-[#999189] transition-colors duration-200 hover:text-[#1a1a1a] active:translate-y-[1px]",
                      focusOnWhite
                    )}
                    style={{ fontFamily: editorialFont }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
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
    <Magnetic strength={0.4}>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
        aria-label={ariaLabel}
        className={cx(
          "fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c7] bg-white/95 text-[#66615c] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#aaa095] hover:text-[#1a1a1a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f6f3]",
          show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <ArrowUpIcon size={14} />
      </button>
    </Magnetic>
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

function HeroInteractiveLayerSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });
  const [ripple, setRipple] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [flashWord, setFlashWord] = useState<string | null>(null);

  const words = ["CREATE", "DEVELOP", "BUILD", "CODE"];
  const wordIndexRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setPos((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();

      setRipple((prev) => [...prev, { id, x, y }]);

      const nextWord = words[wordIndexRef.current % words.length];
      wordIndexRef.current += 1;
      setFlashWord(nextWord);

      window.setTimeout(() => {
        setRipple((prev) => prev.filter((r) => r.id !== id));
      }, 1200);

      window.setTimeout(() => {
        setFlashWord(null);
      }, 700);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 top-0 bottom-0 z-[5]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          left: pos.x,
          top: pos.y,
          opacity: pos.visible ? 1 : 0,
          scale: pos.visible ? 1 : 0.88,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.7,
        }}
        style={{
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(210,190,165,0.13) 0%, rgba(210,190,165,0.06) 30%, rgba(210,190,165,0.025) 52%, transparent 74%)",
          filter: "blur(10px)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          left: pos.x,
          top: pos.y,
          opacity: pos.visible ? 1 : 0,
          scale: pos.visible ? 1 : 0.92,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 26,
          mass: 0.45,
        }}
        style={{
          width: 110,
          height: 110,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(230,217,200,0.14) 40%, transparent 72%)",
          filter: "blur(5px)",
        }}
      />

      {ripple.map((item) => (
        <motion.span
          key={item.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
          initial={{
            left: item.x,
            top: item.y,
            width: 16,
            height: 16,
            opacity: 0.36,
            scale: 0.6,
          }}
          animate={{
            width: 460,
            height: 460,
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            borderColor: "rgba(176, 164, 148, 0.34)",
            boxShadow: "0 0 0 1px rgba(210,190,165,0.04) inset",
          }}
        />
      ))}

      <AnimatePresence>
        {flashWord && (
          <motion.div
            key={flashWord}
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.span
              initial={{ scale: 0.94, y: 18, filter: "blur(8px)" }}
              animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 1.03, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: editorialFont,
                fontSize: "clamp(5rem, 16vw, 11rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                color: "rgba(170, 160, 148, 0.07)",
                WebkitTextStroke: "1px rgba(160,150,138,0.15)",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {flashWord}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}