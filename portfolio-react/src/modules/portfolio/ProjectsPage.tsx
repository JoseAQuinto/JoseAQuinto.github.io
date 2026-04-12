import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../translations/LanguageContext";

const editorialFont = "'Georgia', 'Times New Roman', serif";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ── Hook: scroll progress of an element ───────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

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

// ── watermark ─────────────────────────────────────────────────────────────────
function SectionWatermark({
  text,
  align = "right",
  tone = "warm",
}: {
  text: string;
  align?: "left" | "right";
  tone?: "warm" | "light";
}) {
  const isRight = align === "right";

  return (
    <div
      aria-hidden
      className={cx(
        "pointer-events-none absolute inset-x-0 top-8 z-0 select-none overflow-hidden"
      )}
    >
      <span
        className={cx(
          "block whitespace-nowrap leading-none",
          isRight ? "text-right pr-8 sm:pr-12 lg:pr-16" : "text-left pl-8 sm:pl-12 lg:pl-16"
        )}
        style={{
          fontFamily: editorialFont,
          fontSize: "clamp(4.2rem, 10vw, 10rem)",
          fontWeight: 400,
          letterSpacing: "-0.055em",
          lineHeight: 0.9,
          color:
            tone === "warm"
              ? "rgba(186, 176, 163, 0.08)"
              : "rgba(210, 205, 198, 0.07)",
          WebkitTextStroke:
            tone === "warm"
              ? "1px rgba(170, 160, 148, 0.16)"
              : "1px rgba(190, 184, 176, 0.14)",
          textShadow:
            tone === "warm"
              ? "0 10px 30px rgba(120, 108, 94, 0.05)"
              : "0 10px 30px rgba(140, 132, 124, 0.035)",
          filter: "blur(0.15px)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ── FadeUp ─────────────────────────────────────────────────────────────────
function FadeUp({
  show, delay = 0, y = 18, className = "", children,
}: {
  show: boolean; delay?: number; y?: number; className?: string; children: ReactNode;
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

// ── Magnetic button wrapper ────────────────────────────────────────────────
function Magnetic({
  children, strength = 0.35, className = "",
}: {
  children: ReactNode; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setDelta({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  }, [strength]);

  const onMouseLeave = useCallback(() => setDelta({ x: 0, y: 0 }), []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `translate(${delta.x}px, ${delta.y}px)`,
        transition: delta.x === 0 && delta.y === 0
          ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)"
          : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}

// ── Spotlight card effect ──────────────────────────────────────────────────
function SpotlightCard({
  children, className = "",
}: { children: ReactNode; className?: string }) {
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

  const onMouseLeave = useCallback(() =>
    setSpotlight(s => ({ ...s, opacity: 0 })), []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative" }}
    >
      {/* spotlight glow */}
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

// ── Scroll-reveal section ─────────────────────────────────────────────────
function RevealSection({
  children, className = "", delay = 0,
}: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Floating particles ────────────────────────────────────────────────────
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.91) * 43758.5453123;
  return x - Math.floor(x);
}

function FloatingParticles() {
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

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#9e968c",
            opacity: p.opacity,
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ── Stagger text reveal ───────────────────────────────────────────────────
function StaggerText({ text, show, delay = 0 }: { text: string; show: boolean; delay?: number }) {
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

// ── Tilt card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: ny * -4, y: nx * 4 });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.012 : 1})`,
        transition: hovered
          ? "transform 0.15s ease-out"
          : "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
        willChange: "transform",
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
  const parallaxOffset = useParallax(0.06);

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
        ([entry]) => { if (entry.isIntersecting) setActiveSection("hero"); },
        { threshold: 0.35 }
      );
      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }
    ["about", "projects"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-18% 0px -58% 0px", threshold: 0.02 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navLinks = useMemo(() => [
    { id: "about", label: page.aboutTitle },
    { id: "projects", label: page.projectsTitle },
  ], [page.aboutTitle, page.projectsTitle]);

  const baseFocusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2";
  const focusOnWarm = `${baseFocusRing} focus-visible:ring-offset-[#f7f6f3]`;
  const focusOnWhite = `${baseFocusRing} focus-visible:ring-offset-white`;

  return (
    <>
      {/* ── Global keyframes ── */}
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
        {/* ── NAV ── */}
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
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
                        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                      className={cx(
                        "nav-link-hover group relative rounded-sm pb-1 text-xs uppercase tracking-[0.14em] transition-[color,transform] duration-200 active:translate-y-[1px]",
                        isActive ? "active text-[#1a1a1a]" : "text-[#8a847c] hover:text-[#1a1a1a]",
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

        {/* ── HERO ── */}
        <header
          ref={heroRef}
          className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-[#f7f6f3]"
        >
          {/* Particles */}
          <FloatingParticles />

          {/* Parallax decorative shapes */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            <div className="absolute left-1/2 top-0 h-40 w-px bg-gradient-to-b from-transparent to-[#ccc7bf]" />
            <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-gradient-to-t from-[#f1eee8]/55 via-transparent to-transparent" />
            <div
              className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-[#efe9df] opacity-40 blur-3xl"
              style={{ animation: "float 12s ease-in-out infinite alternate" }}
            />
            <div
              className="absolute -left-16 bottom-32 h-48 w-48 rounded-full bg-[#e8e2d8] opacity-25 blur-2xl"
              style={{ animation: "float 9s ease-in-out 3s infinite alternate" }}
            />
          </div>

          {/* Grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: "grain 0.5s steps(1) infinite",
            }}
          />

          <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-36 sm:px-8">
            <FadeUp show={mounted} delay={80} y={12} className="mb-10">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-[#9f988e]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#777068]" style={{ fontFamily: editorialFont }}>
                  {page.badge}
                </span>
                {/* Live pulse dot */}
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-[#9f988e] opacity-75"
                    style={{ animation: "pulse-ring 2s cubic-bezier(0,0,0.2,1) infinite" }}
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
                <StaggerText text={page.title} show={mounted} delay={200} />
              </h1>
            </FadeUp>

            <FadeUp show={mounted} delay={300} y={14}>
              <p className="mt-6 max-w-2xl text-[1.03rem] font-normal leading-[1.8] text-[#403b36]" style={{ fontFamily: editorialFont }}>
                {page.subtitle}
              </p>
            </FadeUp>

            <FadeUp show={mounted} delay={390} y={14}>
              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                <p className="max-w-xl text-sm leading-[1.95] text-[#66615b]" style={{ fontFamily: editorialFont }}>
                  {page.intro}
                </p>
                <div className="hidden lg:block">
                  <SpotlightCard className="rounded-[22px] border border-[#e4dfd8] bg-white/50 px-5 py-5 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[#d4ccc1] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b948a]" style={{ fontFamily: editorialFont }}>
                      {page.heroAsideTitle}
                    </p>
                    <p className="mt-3 text-sm leading-[1.85] text-[#5f5952]" style={{ fontFamily: editorialFont }}>
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
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
                  { href: "https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/", label: "LinkedIn" },
                  { href: "https://github.com/JoseAQuinto/JoseAQuinto.github.io", label: "GitHub" },
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
                  <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#989187]" style={{ fontFamily: editorialFont }}>
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
                    <p className="max-w-[160px] text-[11px] leading-[1.8] text-[#8f887e]" style={{ fontFamily: editorialFont }}>
                      {page.heroBottomNote}
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#ddd7cf]" />

          {/* Scroll indicator */}
          <div
            className={cx(
              "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000",
              mounted ? "opacity-60" : "opacity-0"
            )}
            style={{ transitionDelay: "1400ms" }}
          >
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#9e968c]" style={{ fontFamily: editorialFont }}>
              Scroll
            </span>
            <div className="relative h-10 w-px overflow-hidden bg-[#ddd7cf]">
              <div
                className="absolute inset-x-0 top-0 h-1/2 bg-[#9e968c]"
                style={{ animation: "scan-line 1.8s ease-in-out infinite" }}
              />
            </div>
          </div>
        </header>

        {/* ── ABOUT ── */}
        <section id="about" className="relative scroll-mt-28 bg-white py-28 overflow-hidden">
          {/* Decorative watermark */}
          <SectionWatermark
            text={language === "es" ? "Sobre mí" : "About me"}
            align="right"
            tone="light"
          />

          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <RevealSection className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-6">
                <div className="h-px w-6 bg-[#999189] transition-all duration-700 group-hover:w-12" />
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#777068]" style={{ fontFamily: editorialFont }}>
                  {page.aboutTitle}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-[1.9] text-[#6d655f]" style={{ fontFamily: editorialFont }}>
                {page.aboutSectionNote}
              </p>
            </RevealSection>

            <div className="grid gap-0 md:grid-cols-2">
              {page.experience.map((item, index) => (
                <RevealSection key={index} delay={index * 100}>
                  <SpotlightCard className="group relative border-t border-[#e8e4de] p-8 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:bg-[#fcfbf8] hover:shadow-[0_16px_48px_rgba(0,0,0,0.04)] first:border-t-0 md:first:border-t md:[&:nth-child(2)]:border-t-0 md:odd:border-r md:border-r-[#e8e4de]">
                    <div className="absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-[#cfc6ba] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    <span className="mb-5 block text-[10px] tabular-nums tracking-[0.2em] text-[#b7b0a8]" style={{ fontFamily: editorialFont }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mb-3 max-w-[22ch] text-[1.04rem] font-normal leading-[1.5] text-[#171717] transition-colors duration-200 group-hover:text-[#000]" style={{ fontFamily: editorialFont }}>
                      {item.title}
                    </h3>
                    <p className="max-w-[54ch] text-sm leading-[1.95] text-[#66615c]" style={{ fontFamily: editorialFont }}>
                      {item.description}
                    </p>
                  </SpotlightCard>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="relative scroll-mt-28 bg-[#f7f6f3] py-32 overflow-hidden">
          {/* Decorative watermark */}
          <SectionWatermark
            text={language === "es" ? "Proyectos" : "Projects"}
            align="left"
            tone="warm"
          />

          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <RevealSection className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-block text-[10px] uppercase tracking-[0.22em] text-[#8a8279]" style={{ fontFamily: editorialFont }}>
                  {page.projectsEyebrow}
                </span>
                <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.25rem)] font-normal leading-tight text-[#171717]" style={{ fontFamily: editorialFont }}>
                  {page.projectsTitle}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-[1.95] text-[#66615c]" style={{ fontFamily: editorialFont }}>
                {page.projectsSubtitle}
              </p>
            </RevealSection>

            <div className="grid gap-5">
              {page.projects.map((project, index) => (
                <RevealSection key={project.id} delay={index * 120}>
                  <TiltCard>
                    <SpotlightCard
                      className={cx(
                        "group relative overflow-hidden rounded-[30px] border border-[#e5dfd6] bg-white/88 p-6 backdrop-blur-sm transition-[box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#d8cfc3] hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:p-8"
                      )}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8d0c5] to-transparent opacity-90" />

                      {/* Animated corner accent */}
                      <div className="absolute right-0 top-0 h-24 w-24 overflow-hidden rounded-bl-none rounded-tr-[30px]">
                        <div
                          className="absolute right-0 top-0 h-16 w-16 origin-top-right scale-0 rounded-full bg-gradient-to-br from-[#f0ebe3] to-transparent opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-150 group-hover:opacity-100"
                        />
                      </div>

                      <div className="relative flex h-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-6 flex items-center gap-4">
                            <span className="text-[0.95rem] leading-none text-[#c1b8ac]" style={{ fontFamily: editorialFont }}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="relative h-px w-10 overflow-hidden bg-[#ddd5cb]">
                              <span className="absolute inset-y-0 left-0 w-0 bg-[#9e968c] transition-all duration-500 ease-out group-hover:w-full" />
                            </div>
                          </div>

                          <div className="max-w-3xl">
                            <h3
                              className="text-[1.55rem] font-normal leading-[1.14] tracking-[-0.012em] text-[#161616] transition-colors duration-300 group-hover:text-[#000]"
                              style={{ fontFamily: editorialFont }}
                            >
                              {project.title}
                            </h3>
                            <p className="mt-4 max-w-[64ch] text-[13px] leading-[1.98] text-[#6b655f]" style={{ fontFamily: editorialFont }}>
                              {project.description}
                            </p>
                          </div>

                          <div className="mt-7 flex flex-wrap gap-2.5">
                            {project.tags.map((tag, ti) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full border border-[#e7e0d7] bg-[#fbfaf7] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#79736b] transition-all duration-300 hover:border-[#c4b9ac] hover:bg-white hover:-translate-y-0.5"
                                style={{
                                  fontFamily: editorialFont,
                                  transitionDelay: `${ti * 25}ms`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-8 hidden sm:flex sm:items-center sm:gap-3">
                            <div className="relative h-px w-12 overflow-hidden bg-[#e4ddd4]">
                              <span className="absolute inset-y-0 left-0 w-0 bg-[#cfc6ba] transition-all duration-700 ease-out group-hover:w-full" />
                            </div>
                            <span
                              className="translate-x-0 text-[10px] uppercase tracking-[0.18em] text-[#958e84] opacity-75 transition-all duration-400 ease-out group-hover:translate-x-1.5 group-hover:opacity-100 group-hover:text-[#6f685f]"
                              style={{ fontFamily: editorialFont }}
                            >
                              {page.projectFootnote}
                            </span>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="relative flex w-full flex-col justify-between gap-8 lg:w-[220px] lg:self-stretch lg:pl-8">
                          <div className="absolute bottom-0 left-0 top-0 hidden w-px overflow-hidden bg-[#eee8df] lg:block">
                            <span className="absolute inset-x-0 top-0 h-0 bg-[#d8d0c5] transition-all duration-700 group-hover:h-full" />
                          </div>

                          <div className="flex items-center justify-between lg:flex-col lg:items-end lg:gap-3">
                            <div className="flex flex-col gap-1 lg:items-end">
                              <span className="text-[10px] uppercase tracking-[0.18em] text-[#8f887f]" style={{ fontFamily: editorialFont }}>
                                {page.projectMetaLabel}
                              </span>
                              <span className="text-[11px] text-[#b0a89f]" style={{ fontFamily: editorialFont }}>
                                {page.projectMetaSubLabel}
                              </span>
                            </div>
                            <span className="rounded-full border border-[#ece6dd] bg-[#faf8f4] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#978f86] transition-[background-color,border-color] duration-300 group-hover:border-[#ddd3c7] group-hover:bg-white" style={{ fontFamily: editorialFont }}>
                              {page.projectYear}
                            </span>
                          </div>

                          <div className="flex flex-col gap-4 lg:items-end">
                            <div className="flex items-center gap-3 text-left lg:text-right">
                              <div className="h-8 w-px bg-[#ddd5cb]" />
                              <p className="max-w-[170px] text-[11px] leading-[1.8] text-[#8f887f]" style={{ fontFamily: editorialFont }}>
                                {page.projectSideDescription}
                              </p>
                            </div>

                            <Link
                              to={project.href}
                              className={cx(
                                "group/btn inline-flex items-center gap-2.5 self-start rounded-full border border-[#d8d0c6] bg-[#f8f6f2] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#3f3b37] transition-all duration-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] active:scale-95 active:translate-y-[1px] lg:self-end",
                                focusOnWhite
                              )}
                              style={{ fontFamily: editorialFont }}
                            >
                              <span>{project.cta}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        <BackToTop ariaLabel={common.backToTop} />

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#ddd7cf] bg-white py-10">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-xs tracking-[0.14em] text-[#999189]" style={{ fontFamily: editorialFont }}>
                © {new Date().getFullYear()} {page.footer}
              </p>
              <div className="flex items-center gap-6">
                {[
                  { href: "https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/", label: "LinkedIn" },
                  { href: "https://github.com/JoseAQuinto/JoseAQuinto.github.io", label: "GitHub" },
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
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <ArrowUpIcon size={14} />
      </button>
    </Magnetic>
  );
}

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number; viewBox?: string; className?: string; children?: ReactNode;
};
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