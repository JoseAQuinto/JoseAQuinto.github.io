import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

// PRUEBAS JOSE
function GSAPScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const title = titleRef.current;
    const image = imageRef.current;
    const shapes = shapesRef.current;
    const text = textRef.current;
    const button = buttonRef.current;

    if (!container || !title || !image || !shapes || !text || !button) return;

    const ctx = gsap.context(() => {
      // Timeline principal con ScrollTrigger
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          scrub: 1.2,
          // markers: true, // Descomenta para debug
        },
      });

      // 1. Fondo con efecto parallax y blur
      masterTimeline.fromTo(
        container,
        {
          scale: 0.8,
          filter: "blur(20px)",
          borderRadius: "80px"
        },
        {
          scale: 1,
          filter: "blur(0px)",
          borderRadius: "30px",
          duration: 2,
          ease: "power3.inOut",
        }
      );

      // 2. Título con efecto de revelación 3D
      const titleTimeline = gsap.timeline();
      titleTimeline.fromTo(
        title,
        {
          yPercent: 150,
          rotateZ: 8,
          rotateX: 45,
          opacity: 0,
          scale: 1.2,
        },
        {
          yPercent: 0,
          rotateZ: 0,
          rotateX: 0,
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: "power4.out",
        }
      );

      // 3. Imagen con efecto de revelación máscara
      const imageTimeline = gsap.timeline();
      imageTimeline.fromTo(
        image,
        {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.3,
          filter: "grayscale(100%) brightness(0.7)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          filter: "grayscale(0%) brightness(1)",
          duration: 2,
          ease: "power4.inOut",
        }
      );

      // 4. Formas geométricas con rotación y escala
      gsap.to(shapes.children, {
        scrollTrigger: {
          trigger: shapes,
          start: "top center",
          end: "bottom center",
          scrub: 0.8,
        },
        rotation: 360,
        scale: 1.5,
        opacity: 0,
        stagger: 0.1,
        ease: "none",
      });

      // 5. Efecto de línea decorativa
      gsap.fromTo(
        ".showcase-line",
        {
          scaleX: 0,
          transformOrigin: "left center"
        },
        {
          scaleX: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: container,
            start: "top 60%",
            end: "top 40%",
            scrub: 0.6,
          },
          ease: "power3.inOut",
        }
      );

      // 6. Texto con stagger por palabras
      gsap.fromTo(
        ".showcase-word",
        {
          y: 60,
          opacity: 0,
          rotate: -10,
          scale: 1.3,
        },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          scale: 1,
          stagger: 0.05,
          duration: 1,
          scrollTrigger: {
            trigger: text,
            start: "top 70%",
            end: "top 40%",
            scrub: 0.8,
          },
          ease: "elastic.out(1, 0.5)",
        }
      );

      // 7. Botón con efecto de revelación
      gsap.fromTo(
        button,
        {
          y: 40,
          opacity: 0,
          scale: 0.5,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: button,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.3,
          },
          ease: "back.out(1.5)",
        }
      );

      // 8. Partículas flotantes que reaccionan al scroll
      const particles = document.createElement("div");
      particles.className = "showcase-particles";
      container.appendChild(particles);

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "showcase-particle";
        particle.style.cssText = `
          position: absolute;
          width: ${gsap.utils.random(4, 12)}px;
          height: ${gsap.utils.random(4, 12)}px;
          background: rgba(161, 145, 119, ${gsap.utils.random(0.1, 0.3)});
          border-radius: 50%;
          left: ${gsap.utils.random(10, 90)}%;
          top: ${gsap.utils.random(10, 90)}%;
        `;
        particles.appendChild(particle);

        gsap.to(particle, {
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: gsap.utils.random(0.5, 1.5),
          },
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          scale: gsap.utils.random(0.5, 2),
          rotation: gsap.utils.random(-180, 180),
          opacity: 0,
          duration: 2,
          ease: "none",
        });
      }

      // 9. Efecto de sombra dinámica
      gsap.to(container, {
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 10px 30px rgba(161, 145, 119, 0.5)",
        duration: 1,
      });

      // Combinar todos los timelines
      masterTimeline
        .add(titleTimeline, 0.3)
        .add(imageTimeline, 0.5)
        .add("end");

    }, container);

    return () => ctx.revert();
  }, []);

  const titleWords = "ESTE ES UN EFECTO DE SCROLL ESPECTACULAR".split(" ");

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-4xl overflow-hidden rounded-[30px] bg-gradient-to-br from-[#2a2520] to-[#1a1815] p-1 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #2a2520 0%, #1a1815 50%, #2a2520 100%)",
      }}
    >
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#f7f6f3] to-[#e8e3d8] p-12 md:p-16 overflow-hidden">
        {/* Gradientes decorativos */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#c4b9a8]/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-[#8a7f6e]/5" />

        {/* Formas decorativas flotantes */}
        <div ref={shapesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                background: `radial-gradient(circle, #a19177, transparent)`,
                left: `${20 + i * 15}%`,
                top: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Título con efecto 3D */}
          <div className="overflow-hidden mb-8">
            <h2
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#2a2520] mb-4"
              style={{
                fontFamily: editorialFont,
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                transform: "perspective(500px)"
              }}
            >
              {titleWords.map((word, i) => (
                <span
                  key={i}
                  className="showcase-word inline-block mr-3"
                  style={{ display: "inline-block" }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>

          {/* Línea decorativa animada */}
          <div className="showcase-line h-px bg-gradient-to-r from-[#a19177] via-[#c4b9a8] to-transparent mb-8" />

          {/* Imagen de prueba con efecto máscara */}
          <div
            ref={imageRef}
            className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
            style={{ height: "300px" }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232a2520;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238a7f6e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23grad)'/%3E%3Ccircle cx='200' cy='150' r='80' fill='%23c4b9a8' opacity='0.3'/%3E%3Ccircle cx='600' cy='450' r='120' fill='%23a19177' opacity='0.2'/%3E%3Ctext x='400' y='320' font-family='Georgia' font-size='48' fill='white' text-anchor='middle' opacity='0.9'%3EEfecto Visual%3C/text%3E%3C/svg%3E")`,
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2520]/80 via-transparent to-transparent" />

            {/* Texto overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: editorialFont }}>
                Imagen con Efecto de Revelación
              </h3>
              <p className="text-sm opacity-80" style={{ fontFamily: editorialFont }}>
                Clip-path mask animation
              </p>
            </div>
          </div>

          {/* Texto descriptivo */}
          <p
            ref={textRef}
            className="text-lg text-[#4a4540] mb-8 leading-relaxed max-w-2xl"
            style={{ fontFamily: editorialFont }}
          >
            Este es un elemento de prueba que demuestra un espectacular efecto de scroll
            utilizando GSAP ScrollTrigger con múltiples animaciones sincronizadas,
            incluyendo parallax, revelaciones 3D, máscaras y partículas interactivas.
          </p>

          {/* Botones de acción */}
          <div ref={buttonRef} className="flex gap-4">
            <button
              className="px-6 py-3 bg-gradient-to-r from-[#2a2520] to-[#4a4540] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: editorialFont }}
            >
              Explorar Efecto
            </button>
            <button
              className="px-6 py-3 border-2 border-[#a19177] text-[#2a2520] rounded-full font-medium hover:bg-[#a19177]/10 transition-all duration-300"
              style={{ fontFamily: editorialFont }}
            >
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[#8a7f6e]">
          <span className="text-xs uppercase tracking-wider" style={{ fontFamily: editorialFont }}>
            Scroll para ver magia
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V8a5 5 0 0 1 5-5zm0 1a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V8a4 4 0 0 0-4-4z" />
            <circle cx="8" cy="8" r="1.5" className="animate-bounce" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GSAPHolographicReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const main = mainRef.current;
    const layerBack = layerBackRef.current;
    const layerMid = layerMidRef.current;
    const layerFront = layerFrontRef.current;
    const grid = gridRef.current;
    const stats = statsRef.current;
    const cards = floatingCardsRef.current;

    if (!container || !main || !layerBack || !layerMid || !layerFront || !grid || !stats) return;

    const ctx = gsap.context(() => {
      // Efecto 1: Capas con profundidad y perspectiva
      gsap.set([layerBack, layerMid, layerFront, grid], {
        transformOrigin: "center center",
      });

      const layersTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Capa fondo - movimiento lento
      layersTimeline.to(layerBack, {
        y: -80,
        scale: 1.08,
        filter: "blur(8px) brightness(0.8)",
        rotation: 1,
        ease: "none",
      }, 0);

      // Capa media - movimiento medio
      layersTimeline.to(layerMid, {
        y: -120,
        scale: 0.92,
        filter: "blur(3px) brightness(1.1)",
        rotation: -0.5,
        ease: "none",
      }, 0);

      // Capa frontal - movimiento rápido
      layersTimeline.to(layerFront, {
        y: -200,
        scale: 1.15,
        filter: "blur(0px) brightness(1.3)",
        rotation: 0.8,
        ease: "none",
      }, 0);

      // Grid con distorsión
      layersTimeline.to(grid, {
        scale: 1.2,
        rotation: 5,
        opacity: 0.3,
        backgroundPosition: "100% 100%",
        ease: "none",
      }, 0);

      // Efecto 2: Tarjetas flotantes con diferentes velocidades
      cards.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(card,
          {
            y: gsap.utils.random(100, 300),
            x: gsap.utils.random(-50, 50),
            rotation: gsap.utils.random(-15, 15),
            scale: 0.7,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            y: gsap.utils.random(-200, -100),
            x: gsap.utils.random(-30, 30),
            rotation: gsap.utils.random(-5, 5),
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 1 + index * 0.2,
            },
          }
        );

        // Efecto hover en tarjetas
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            rotation: 0,
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });

      // Efecto 3: Estadísticas con contador
      const statNumbers = stats.querySelectorAll(".stat-number");
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target") || "0");
        const suffix = stat.getAttribute("data-suffix") || "";

        gsap.fromTo(stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: stats,
              start: "top 80%",
              end: "top 30%",
              scrub: 0.5,
            },
            onUpdate: function () {
              stat.textContent = Math.round(this.targets()[0].innerText) + suffix;
            },
          }
        );
      });

      // Efecto 4: Líneas de conexión animadas
      const lines = document.querySelectorAll(".connection-line");
      lines.forEach((line, index) => {
        gsap.fromTo(line,
          {
            scaleX: 0,
            opacity: 0,
          },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.5,
            delay: index * 0.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top 60%",
              end: "top 20%",
              scrub: 0.8,
            },
          }
        );
      });

      // Efecto 5: Partículas de energía
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "energy-particle";
        particle.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          background: #a19177;
          border-radius: 50%;
          left: ${gsap.utils.random(0, 100)}%;
          top: ${gsap.utils.random(0, 100)}%;
          box-shadow: 0 0 10px #a19177, 0 0 20px #c4b9a8;
        `;
        container.appendChild(particle);

        gsap.to(particle, {
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5 + Math.random(),
          },
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-300, 300),
          scale: gsap.utils.random(0, 3),
          opacity: gsap.utils.random(0, 0.8),
          rotation: gsap.utils.random(-360, 360),
          duration: 3,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

      // Efecto 6: Revelación del título principal
      const titleWords = main.querySelectorAll(".holo-title-word");
      gsap.fromTo(titleWords,
        {
          y: 100,
          rotationX: -90,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          rotationX: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: main,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      // Efecto 7: Anillos concéntricos
      gsap.to(".holographic-ring", {
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        rotation: 360,
        scale: 1.5,
        opacity: 0,
        stagger: 0.2,
        ease: "none",
      });

    }, container);

    return () => ctx.revert();
  }, []);

  const floatingCards = [
    { title: "Diseño 3D", subtitle: "Renderizado Avanzado", color: "#2a2520" },
    { title: "Animación", subtitle: "60 FPS Fluid", color: "#3a3530" },
    { title: "Interacción", subtitle: "UX Inmersiva", color: "#4a4540" },
    { title: "Performance", subtitle: "Optimizado", color: "#5a5550" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-6xl overflow-hidden rounded-[40px]"
      style={{
        minHeight: "700px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        perspective: "1000px",
      }}
    >
      {/* Grid de fondo con efecto */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(161, 145, 119, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(161, 145, 119, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
          transformOrigin: "center center",
        }}
      />

      {/* Anillos holográficos */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="holographic-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-20"
          style={{
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
            borderColor: `rgba(161, 145, 119, ${0.1 + i * 0.05})`,
            borderWidth: "1px",
            borderStyle: i === 1 ? "dashed" : "solid",
          }}
        />
      ))}

      {/* Capas de profundidad */}
      <div className="relative z-10">
        {/* Capa de fondo */}
        <div
          ref={layerBackRef}
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(196, 185, 168, 0.3), transparent 70%)",
          }}
        />

        {/* Capa media */}
        <div
          ref={layerMidRef}
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(circle at 30% 70%, rgba(161, 145, 119, 0.4), transparent 50%)",
          }}
        />

        {/* Capa frontal */}
        <div
          ref={layerFrontRef}
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(138, 127, 110, 0.3), transparent 60%)",
          }}
        />

        {/* Contenido principal */}
        <div ref={mainRef} className="relative z-20 px-8 py-16 md:px-16 md:py-24">
          {/* Título con efecto holográfico */}
          <div className="mb-16 text-center" style={{ perspective: "1000px" }}>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              {"EFECTO HOLOGRÁFICO".split("").map((letter, i) => (
                <span
                  key={i}
                  className="holo-title-word inline-block"
                  style={{
                    display: "inline-block",
                    color: letter === " " ? "transparent" : undefined,
                    textShadow: "0 0 20px rgba(161, 145, 119, 0.5), 0 0 40px rgba(196, 185, 168, 0.3)",
                    width: letter === " " ? "0.5em" : undefined,
                  }}
                >
                  {letter}
                </span>
              ))}
            </h2>

            {/* Línea de conexión animada */}
            <div className="connection-line mx-auto h-px w-64 bg-gradient-to-r from-transparent via-[#a19177] to-transparent mb-8" />

            <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: editorialFont }}>
              Revelación en capas con profundidad de campo y distorsión parallax
            </p>
          </div>

          {/* Tarjetas flotantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {floatingCards.map((card, index) => (
              <div
                key={index}
                ref={(el) => { floatingCardsRef.current[index] = el; }}
                className="group relative rounded-2xl p-6 backdrop-blur-sm cursor-pointer transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(161, 145, 119, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                {/* Efecto hover gradient */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(161, 145, 119, 0.1), rgba(196, 185, 168, 0.05))",
                  }}
                />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}, #a19177)`,
                      boxShadow: `0 0 20px ${card.color}44`,
                    }}
                  />
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: editorialFont }}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500" style={{ fontFamily: editorialFont }}>
                    {card.subtitle}
                  </p>
                </div>

                {/* Línea de conexión */}
                <div className="connection-line absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#a19177]/30 to-transparent" />
              </div>
            ))}
          </div>

          {/* Estadísticas animadas */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { number: 100, suffix: "%", label: "Performance" },
              { number: 60, suffix: "fps", label: "Fluidez" },
              { number: 24, suffix: "k", label: "Resolución" },
              { number: 3, suffix: "D", label: "Profundidad" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="stat-number text-4xl md:text-5xl font-bold text-white mb-2"
                  data-target={stat.number}
                  data-suffix={stat.suffix}
                  style={{
                    fontFamily: editorialFont,
                    textShadow: "0 0 15px rgba(161, 145, 119, 0.3)",
                  }}
                >
                  0{stat.suffix}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Zona interactiva */}
          <div className="text-center">
            <div className="connection-line mx-auto h-px w-48 bg-gradient-to-r from-transparent via-[#a19177] to-transparent mb-8" />

            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-[#a19177] to-[#c4b9a8] text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#a19177]/30 active:scale-95"
              style={{ fontFamily: editorialFont }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
            >
              <span className="relative z-10">Explorar Tecnología</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de profundidad */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#a19177] animate-pulse" />
          <span className="text-xs text-gray-600 uppercase tracking-wider" style={{ fontFamily: editorialFont }}>
            Capa 1
          </span>
        </div>
        <div className="connection-line w-12 h-px bg-gradient-to-r from-[#a19177]/30 to-[#a19177]/60" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#c4b9a8] animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="text-xs text-gray-600 uppercase tracking-wider" style={{ fontFamily: editorialFont }}>
            Capa 2
          </span>
        </div>
        <div className="connection-line w-12 h-px bg-gradient-to-r from-[#a19177]/60 to-[#a19177]" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.4s" }} />
          <span className="text-xs text-gray-600 uppercase tracking-wider" style={{ fontFamily: editorialFont }}>
            Capa 3
          </span>
        </div>
      </div>
    </div>
  );
}

function GSAPGeometricDeconstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hexagonsRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const mainTitle = mainTitleRef.current;
    const canvas = canvasRef.current;
    const hexagons = hexagonsRef.current;
    const fragments = fragmentsRef.current;
    const features = featuresRef.current;

    if (!container || !mainTitle || !canvas || !hexagons || !fragments || !features) return;

    const ctx = gsap.context(() => {
      // 1. Efecto de explosión/reconstrucción del título
      const titleLetters = mainTitle.querySelectorAll('.deconstruct-letter');

      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "top center",
          scrub: 1,
        },
      });

      titleLetters.forEach((letter, index) => {
        // Movimiento caótico inicial
        gsap.set(letter, {
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-300, 300),
          rotation: gsap.utils.random(-180, 180),
          scale: gsap.utils.random(0.3, 3),
          opacity: 0,
        });

        titleTimeline.to(letter, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.4)",
        }, index * 0.02);
      });

      // 2. Hexágonos que se reorganizan
      const hexElements = hexagons.querySelectorAll('.hexagon-piece');

      const hexTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: hexagons,
          start: "top bottom",
          end: "bottom center",
          scrub: 1.2,
        },
      });

      hexElements.forEach((hex, index) => {
        // Configuración inicial fragmentada
        gsap.set(hex, {
          scale: 0,
          rotation: gsap.utils.random(-360, 360),
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          opacity: 0,
          filter: "blur(10px)",
        });

        hexTimeline.to(hex, {
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "back.out(1.7)",
        }, index * 0.1);
      });

      // 3. Fragmentos flotantes con física
      const fragmentPieces = fragments.querySelectorAll('.fragment-piece');

      fragmentPieces.forEach((piece, index) => {
        const randomX = gsap.utils.random(-150, 150);
        const randomY = gsap.utils.random(-200, 200);
        const randomDuration = gsap.utils.random(1.5, 3);

        gsap.to(piece, {
          x: randomX,
          y: randomY,
          rotation: gsap.utils.random(-360, 360),
          scale: gsap.utils.random(0.5, 1.5),
          opacity: gsap.utils.random(0.3, 0.8),
          duration: randomDuration,
          ease: "none",
          repeat: -1,
          yoyo: true,
          scrollTrigger: {
            trigger: fragments,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      // 4. Características con revelación en espiral
      const featureCards = features.querySelectorAll('.feature-card');

      featureCards.forEach((card, index) => {
        const angle = (index / featureCards.length) * Math.PI * 2;
        const radius = 200;

        gsap.fromTo(card,
          {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            rotation: 360,
            scale: 0,
            opacity: 0,
            filter: "blur(15px)",
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.5,
            delay: index * 0.15,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: features,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.7,
            },
          }
        );
      });

      // 5. Líneas de conexión dinámicas
      const connectionLines = document.querySelectorAll('.dynamic-line');

      connectionLines.forEach((line, index) => {
        gsap.fromTo(line,
          {
            scaleX: 0,
            scaleY: 0,
            opacity: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 1.2,
            delay: index * 0.2,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top center",
              end: "bottom center",
              scrub: 0.8,
            },
          }
        );
      });

      // 6. Partículas geométricas
      for (let i = 0; i < 30; i++) {
        const shape = document.createElement("div");
        const shapes = ["polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"];

        shape.style.cssText = `
          position: absolute;
          width: ${gsap.utils.random(5, 15)}px;
          height: ${gsap.utils.random(5, 15)}px;
          background: ${gsap.utils.random(["#a19177", "#c4b9a8", "#8a7f6e", "#2a2520"])};
          clip-path: ${shapes[i % shapes.length]};
          left: ${gsap.utils.random(0, 100)}%;
          top: ${gsap.utils.random(0, 100)}%;
          opacity: 0;
        `;
        container.appendChild(shape);

        gsap.fromTo(shape,
          {
            x: gsap.utils.random(-100, 100),
            y: gsap.utils.random(-100, 100),
            rotation: 0,
            scale: 0,
            opacity: 0,
          },
          {
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-50, 50),
            rotation: gsap.utils.random(-360, 360),
            scale: gsap.utils.random(0.5, 2),
            opacity: gsap.utils.random(0.1, 0.4),
            duration: 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          }
        );
      }

      // 7. Efecto de onda en el fondo
      const waveElements = canvas.querySelectorAll('.wave-layer');

      waveElements.forEach((wave, index) => {
        gsap.to(wave, {
          x: `${gsap.utils.random(-20, 20)}%`,
          y: `${gsap.utils.random(-10, 10)}%`,
          scaleX: gsap.utils.random(0.9, 1.1),
          scaleY: gsap.utils.random(0.9, 1.1),
          rotation: gsap.utils.random(-5, 5),
          duration: 3 + index,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5 + index * 0.1,
          },
        });
      });

      // 8. Números que se revelan
      const numberElements = document.querySelectorAll('.reveal-number');

      numberElements.forEach((num, index) => {
        gsap.fromTo(num,
          {
            y: 100,
            rotationX: 90,
            opacity: 0,
            scale: 0.5,
          },
          {
            y: 0,
            rotationX: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: index * 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: num,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );
      });

    }, container);

    return () => ctx.revert();
  }, []);

  const title = "DECONSTRUCCIÓN GEOMÉTRICA";
  const featuresList = [
    { icon: "⬡", title: "Geometría Viva", desc: "Formas que mutan y se reorganizan" },
    { icon: "◇", title: "Física Aplicada", desc: "Movimiento con inercia realista" },
    { icon: "△", title: "Fragmentación", desc: "Elementos que se descomponen" },
    { icon: "□", title: "Reconstrucción", desc: "Ensamblaje progresivo" },
    { icon: "⬠", title: "Patrones", desc: "Ritmos visuales complejos" },
    { icon: "⬢", title: "Profundidad", desc: "Múltiples planos de acción" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-6xl overflow-hidden rounded-[40px]"
      style={{
        minHeight: "800px",
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8e0d5 30%, #dfd6c8 70%, #f5f0e8 100%)",
      }}
    >
      {/* Capas de ondas de fondo */}
      <div ref={canvasRef} className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="wave-layer absolute rounded-full opacity-5"
            style={{
              width: `${600 + i * 200}px`,
              height: `${600 + i * 200}px`,
              background: `radial-gradient(circle, #2a2520 ${30 - i * 10}%, transparent 70%)`,
              left: `${30 + i * 15}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Grid geométrico decorativo */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #2a2520 1px, transparent 1px),
            linear-gradient(-30deg, #2a2520 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
        {/* Título deconstruido */}
        <div className="mb-20 text-center">
          <div ref={hexagonsRef} className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="hexagon-piece w-8 h-8 opacity-20"
                style={{
                  background: "#a19177",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              />
            ))}
          </div>

          <h2
            ref={mainTitleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
            style={{ fontFamily: editorialFont }}
          >
            {title.split("").map((letter, i) => (
              <span
                key={i}
                className="deconstruct-letter inline-block"
                style={{
                  color: i % 3 === 0 ? "#2a2520" : i % 3 === 1 ? "#5a5550" : "#8a7f6e",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.05)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h2>

          {/* Líneas dinámicas */}
          <div className="relative mb-8">
            <div className="dynamic-line h-px bg-gradient-to-r from-transparent via-[#2a2520] to-transparent" />
            <div className="dynamic-line h-px bg-gradient-to-r from-transparent via-[#a19177] to-transparent mt-2" style={{ width: "70%", margin: "0 auto" }} />
            <div className="dynamic-line h-px bg-gradient-to-r from-transparent via-[#c4b9a8] to-transparent mt-2" style={{ width: "40%", margin: "0 auto" }} />
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: editorialFont }}>
            Observa cómo los elementos se fragmentan y reconstruyen mientras navegas
          </p>
        </div>

        {/* Fragmentos flotantes */}
        <div ref={fragmentsRef} className="relative h-40 mb-16">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="fragment-piece absolute opacity-0"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
                width: `${20 + i * 5}px`,
                height: `${20 + i * 5}px`,
                background: `rgba(${161 - i * 10}, ${145 - i * 10}, ${119 - i * 10}, 0.3)`,
                clipPath: i % 3 === 0 ? "polygon(50% 0%, 0% 100%, 100% 100%)" :
                  i % 3 === 1 ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" :
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              }}
            />
          ))}
        </div>

        {/* Características en espiral */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#d0c8bb] hover:bg-white/90 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  rotation: gsap.utils.random(-2, 2),
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  borderColor: "#a19177",
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  rotation: 0,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  borderColor: "#d0c8bb",
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
            >
              {/* Decoración geométrica */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, #2a2520, transparent)",
                }}
              />

              <div className="relative z-10">
                <div className="text-3xl mb-4 reveal-number" style={{ fontFamily: editorialFont }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#2a2520] reveal-number" style={{ fontFamily: editorialFont }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 reveal-number" style={{ fontFamily: editorialFont }}>
                  {feature.desc}
                </p>

                {/* Línea decorativa que se revela */}
                <div className="mt-4 h-px bg-gradient-to-r from-[#a19177] to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Zona de interacción */}
        <div className="text-center relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#d0c8bb]/30 animate-pulse" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-[#a19177]/20 animate-pulse" style={{ animationDelay: "0.5s" }} />

          <button
            className="reveal-number group relative px-8 py-4 bg-[#2a2520] text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:bg-[#3a3530] hover:shadow-2xl hover:shadow-[#2a2520]/20 active:scale-95"
            style={{ fontFamily: editorialFont }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(2)",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
          >
            <span className="relative z-10">Experimentar Deconstrucción</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#a19177] to-[#c4b9a8] transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </div>

        {/* Indicador de partículas */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#2a2520] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: editorialFont }}>
            Partículas Activas
          </span>
        </div>
      </div>

      {/* Líneas de escape */}
      <div className="absolute bottom-0 left-0 right-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-px opacity-0"
            style={{
              background: `linear-gradient(90deg, transparent, #a19177 ${30 + i * 10}%, transparent)`,
              marginBottom: "4px",
              animation: `escape-line 3s ${i * 0.6}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GSAPLiquidDimension() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pillarsRef = useRef<HTMLDivElement[]>([]);
  const rippleRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const blobContainer = blobContainerRef.current;
    const title = titleRef.current;
    const pillars = pillarsRef.current.filter(Boolean);
    const ripple = rippleRef.current;
    const gallery = galleryRef.current;

    if (!container || !blobContainer || !title || !ripple || !gallery) return;

    const ctx = gsap.context(() => {
      // 1. Blobs orgánicos que se deforman y fluyen
      for (let i = 0; i < 6; i++) {
        const blob = document.createElement("div");
        blob.className = "liquid-blob";
        const size = gsap.utils.random(100, 300);
        blob.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle at ${gsap.utils.random(20, 80)}% ${gsap.utils.random(20, 80)}%, 
            rgba(161, 145, 119, ${gsap.utils.random(0.05, 0.15)}), 
            rgba(42, 37, 32, ${gsap.utils.random(0.03, 0.08)}));
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          left: ${gsap.utils.random(0, 80)}%;
          top: ${gsap.utils.random(0, 80)}%;
          filter: blur(${gsap.utils.random(20, 60)}px);
        `;
        blobContainer.appendChild(blob);

        // Animación de morphing continuo
        gsap.to(blob, {
          borderRadius: `${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}% / ${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}% ${gsap.utils.random(30, 80)}%`,
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          scale: gsap.utils.random(0.8, 1.5),
          duration: gsap.utils.random(8, 15),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Movimiento con scroll
        gsap.to(blob, {
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-300, 300),
          scale: gsap.utils.random(0.5, 2),
          duration: 3,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // 2. Título con efecto de líquido que se estira
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "top 40%",
          scrub: 1,
        },
      });

      // Cada carácter tiene animación independiente tipo onda
      title.querySelectorAll('.liquid-char').forEach((char: Element, index: number) => {
        gsap.set(char, {
          y: gsap.utils.random(100, 300),
          scaleY: gsap.utils.random(0.5, 2),
          opacity: 0,
          filter: "blur(20px)",
        });

        titleTimeline.to(char, {
          y: 0,
          scaleY: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
        }, index * 0.03);

        // Onda continua después de aparecer
        gsap.to(char, {
          y: -10,
          scaleY: 1.1,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1,
        });
      });

      // 3. Pilares que se elevan como líquido
      pillars.forEach((pillar, index) => {
        gsap.set(pillar, {
          scaleY: 0,
          transformOrigin: "bottom center",
          opacity: 0,
        });

        gsap.to(pillar, {
          scaleY: 1,
          opacity: 1,
          duration: 1.8,
          delay: index * 0.4,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: pillar,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.7,
          },
        });

        // Oscilación líquida
        gsap.to(pillar, {
          scaleY: gsap.utils.random(0.8, 1.2),
          scaleX: gsap.utils.random(0.9, 1.1),
          skewX: gsap.utils.random(-5, 5),
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });
      });

      // 4. Efecto de ondulación en el ripple
      const rippleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ripple,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      rippleTimeline.fromTo(ripple,
        {
          scale: 0.3,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power3.inOut",
        }
      );

      // 5. Galería con efecto de distorsión líquida
      const galleryItems = gallery.querySelectorAll('.gallery-item');

      galleryItems.forEach((item: Element, index: number) => {
        gsap.fromTo(item,
          {
            y: gsap.utils.random(200, 500),
            scale: gsap.utils.random(0.5, 0.8),
            opacity: 0,
            filter: "blur(30px) hue-rotate(90deg)",
            borderRadius: "50%",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px) hue-rotate(0deg)",
            borderRadius: "20px",
            duration: 2,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
              trigger: gallery,
              start: "top 80%",
              end: "top 30%",
              scrub: 0.8,
            },
          }
        );

        // Efecto hover con distorsión
        item.addEventListener("mousemove", (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (item as HTMLElement).getBoundingClientRect();
          const x = (mouseEvent.clientX - rect.left) / rect.width;
          const y = (mouseEvent.clientY - rect.top) / rect.height;

          gsap.to(item, {
            borderRadius: `${30 + x * 20}% ${30 + y * 20}% ${30 + (1 - x) * 20}% ${30 + (1 - y) * 20}%`,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            borderRadius: "20px",
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });

      // 6. Burbujas que suben
      const createBubble = () => {
        const bubble = document.createElement("div");
        bubble.className = "liquid-bubble";
        const size = gsap.utils.random(10, 40);
        bubble.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(161, 145, 119, 0.2));
          border-radius: 50%;
          left: ${gsap.utils.random(0, 100)}%;
          bottom: -50px;
          opacity: 0;
        `;
        container.appendChild(bubble);

        gsap.fromTo(bubble,
          {
            y: 0,
            x: 0,
            opacity: 0.8,
          },
          {
            y: gsap.utils.random(-400, -800),
            x: gsap.utils.random(-50, 50),
            opacity: 0,
            duration: gsap.utils.random(3, 6),
            ease: "power1.out",
            onComplete: () => {
              bubble.remove();
            },
          }
        );
      };

      // Crear burbujas periódicamente
      const bubbleInterval = setInterval(createBubble, 800);

      // 7. Gradientes que fluyen
      const gradientOverlays = document.querySelectorAll('.gradient-flow');
      gradientOverlays.forEach((overlay: Element, index: number) => {
        gsap.to(overlay, {
          backgroundPosition: `${gsap.utils.random(0, 100)}% ${gsap.utils.random(0, 100)}%`,
          duration: gsap.utils.random(5, 10),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      });

      return () => {
        clearInterval(bubbleInterval);
      };

    }, container);

    return () => ctx.revert();
  }, []);

  const galleryItems = [
    { title: "Metamorfosis", color: "#a19177" },
    { title: "Fluidez", color: "#8a7f6e" },
    { title: "Distorsión", color: "#c4b9a8" },
    { title: "Transición", color: "#6a5f4e" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-6xl overflow-hidden rounded-[40px]"
      style={{
        minHeight: "800px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient-shift 15s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes liquid-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 40% 60%; }
          50% { border-radius: 40% 30% 60% 60% / 40% 70% 30% 60%; }
          75% { border-radius: 70% 30% 40% 60% / 30% 40% 60% 40%; }
        }
      `}</style>

      {/* Contenedor de blobs */}
      <div ref={blobContainerRef} className="absolute inset-0 overflow-hidden" />

      {/* Gradientes fluidos */}
      <div className="gradient-flow absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(161, 145, 119, 0.2), transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="gradient-flow absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 70%, rgba(138, 127, 110, 0.3), transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Partículas de luz */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${gsap.utils.random(2, 6)}px`,
              height: `${gsap.utils.random(2, 6)}px`,
              background: "white",
              left: `${gsap.utils.random(0, 100)}%`,
              top: `${gsap.utils.random(0, 100)}%`,
              opacity: gsap.utils.random(0.1, 0.4),
              animationDelay: `${gsap.utils.random(0, 3)}s`,
              animationDuration: `${gsap.utils.random(1, 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
        {/* Título líquido */}
        <div className="text-center mb-16">
          <div ref={rippleRef} className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-[#a19177]/30 animate-ping" />
            <div className="relative px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <span className="text-sm text-[#a19177] uppercase tracking-widest" style={{ fontFamily: editorialFont }}>
                Dimensión Líquida
              </span>
            </div>
          </div>

          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
            style={{ fontFamily: editorialFont }}
          >
            {"PORTAL LÍQUIDO".split("").map((char, i) => (
              <span
                key={i}
                className="liquid-char inline-block"
                style={{
                  textShadow: "0 0 20px rgba(161, 145, 119, 0.4)",
                  display: "inline-block",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: editorialFont }}>
            Morphing orgánico y transiciones fluidas que responden al movimiento
          </p>
        </div>

        {/* Pilares líquidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { height: 200, color: "#a19177", label: "Viscosidad" },
            { height: 250, color: "#8a7f6e", label: "Fluidez" },
            { height: 180, color: "#c4b9a8", label: "Densidad" },
            { height: 220, color: "#6a5f4e", label: "Presión" },
          ].map((pillar, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              <div
                ref={(el) => { pillarsRef.current[index] = el; }}
                className="w-full rounded-full relative overflow-hidden"
                style={{
                  height: `${pillar.height}px`,
                  background: `linear-gradient(180deg, ${pillar.color} 0%, ${pillar.color}88 50%, ${pillar.color}22 100%)`,
                  boxShadow: `0 0 30px ${pillar.color}33`,
                }}
              >
                {/* Efecto de superficie líquida */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 rounded-full"
                  style={{
                    animation: "liquid-surface 3s ease-in-out infinite",
                  }}
                />
              </div>
              <span className="text-sm text-gray-400" style={{ fontFamily: editorialFont }}>
                {pillar.label}
              </span>
            </div>
          ))}
        </div>

        {/* Galería morphing */}
        <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="gallery-item group relative h-64 rounded-[20px] overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)`,
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                transition: "border-radius 0.3s ease",
              }}
            >
              {/* Contenido líquido interno */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${item.color}, transparent)`,
                  animation: "liquid-morph 8s ease-in-out infinite",
                }}
              />

              {/* Overlay con blur */}
              <div className="absolute inset-0 backdrop-blur-sm" />

              {/* Contenido */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 rounded-full mb-4"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, white, ${item.color})`,
                    boxShadow: `0 0 30px ${item.color}66`,
                    animation: "liquid-morph 6s ease-in-out infinite",
                  }}
                />
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: editorialFont }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400" style={{ fontFamily: editorialFont }}>
                  Efecto de morphing líquido
                </p>
              </div>

              {/* Borde líquido animado */}
              <div className="absolute inset-0 rounded-[inherit] border-2 border-transparent"
                style={{
                  background: `linear-gradient(45deg, ${item.color}, transparent, ${item.color}) border-box`,
                  WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            </div>
          ))}
        </div>

        {/* Botón líquido */}
        <div className="text-center">
          <button
            className="group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #a19177, #8a7f6e)",
              boxShadow: "0 10px 40px rgba(161, 145, 119, 0.3)",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                borderRadius: "9999px",
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
              });
            }}
          >
            <span className="relative z-10 text-white font-medium" style={{ fontFamily: editorialFont }}>
              Sumergirse en el Portal
            </span>
            {/* Ondulación en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: "wave 2s linear infinite",
              }}
            />
          </button>
        </div>
      </div>

      {/* Indicador de profundidad líquida */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 rounded-full bg-[#a19177] animate-ping opacity-75" />
            <div className="relative rounded-full w-3 h-3 bg-[#a19177]" />
          </div>
          <span className="text-xs text-gray-500" style={{ fontFamily: editorialFont }}>
            Superficie
          </span>
        </div>
        <div className="w-8 h-px bg-gradient-to-r from-[#a19177]/50 to-transparent" />
        <div className="flex items-center gap-2">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 rounded-full bg-[#8a7f6e] animate-pulse opacity-75" />
            <div className="relative rounded-full w-3 h-3 bg-[#8a7f6e]" />
          </div>
          <span className="text-xs text-gray-500" style={{ fontFamily: editorialFont }}>
            Profundidad
          </span>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        @keyframes liquid-surface {
          0%, 100% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(2px) scaleX(0.8); }
        }
      `}</style>
    </div>
  );
}

function GSAPCosmicWeave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const threadsRef = useRef<HTMLDivElement>(null);
  const constellationsRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const stars = starsRef.current;
    const threads = threadsRef.current;
    const constellations = constellationsRef.current;
    const title = titleRef.current;
    const nodes = nodesRef.current.filter(Boolean);

    if (!container || !stars || !threads || !constellations || !title) return;

    const ctx = gsap.context(() => {
      // 1. Campo de estrellas con parallax
      for (let i = 0; i < 50; i++) {
        const star = document.createElement("div");
        star.className = "cosmic-star";
        const size = gsap.utils.random(1, 4);
        const depth = gsap.utils.random(0.2, 1);

        star.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          left: ${gsap.utils.random(0, 100)}%;
          top: ${gsap.utils.random(0, 100)}%;
          opacity: ${gsap.utils.random(0.2, 0.8)};
          box-shadow: 0 0 ${size * 3}px rgba(255, 255, 255, 0.5),
                      0 0 ${size * 6}px rgba(161, 145, 119, 0.3);
        `;
        stars.appendChild(star);

        // Parpadeo individual
        gsap.to(star, {
          opacity: gsap.utils.random(0.1, 0.9),
          scale: gsap.utils.random(0.5, 1.5),
          duration: gsap.utils.random(1, 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });

        // Movimiento con scroll (estrellas cercanas se mueven más rápido)
        gsap.to(star, {
          y: -200 * depth,
          x: gsap.utils.random(-50, 50) * depth,
          scale: 1 + depth,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5 * depth,
          },
        });
      }

      // 2. Hilos de luz que se tejen
      const threadElements: HTMLDivElement[] = [];
      for (let i = 0; i < 8; i++) {
        const thread = document.createElement("div");
        thread.className = "cosmic-thread";
        thread.style.cssText = `
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(161, 145, 119, ${gsap.utils.random(0.1, 0.4)}), 
            rgba(196, 185, 168, ${gsap.utils.random(0.2, 0.5)}),
            rgba(161, 145, 119, ${gsap.utils.random(0.1, 0.4)}), 
            transparent);
          left: ${gsap.utils.random(-20, 80)}%;
          top: ${gsap.utils.random(0, 100)}%;
          width: ${gsap.utils.random(30, 80)}%;
          transform: rotate(${gsap.utils.random(-15, 15)}deg);
          opacity: 0;
        `;
        threads.appendChild(thread);
        threadElements.push(thread);

        // Animación de tejido
        gsap.fromTo(thread,
          {
            scaleX: 0,
            opacity: 0,
          },
          {
            scaleX: 1,
            opacity: 1,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom center",
              scrub: 0.6,
            },
          }
        );

        // Ondulación continua
        gsap.to(thread, {
          y: gsap.utils.random(-30, 30),
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 3),
        });
      }

      // 3. Constelaciones que se dibujan
      const constellationPoints: { x: number, y: number }[] = [];
      for (let i = 0; i < 12; i++) {
        const point = document.createElement("div");
        point.className = "constellation-node";
        point.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: #a19177;
          border-radius: 50%;
          left: ${gsap.utils.random(10, 90)}%;
          top: ${gsap.utils.random(10, 90)}%;
          box-shadow: 0 0 10px #a19177, 0 0 20px #c4b9a8;
          opacity: 0;
        `;
        constellations.appendChild(point);
        constellationPoints.push({
          x: parseFloat(point.style.left),
          y: parseFloat(point.style.top),
        });

        // Aparición secuencial
        gsap.fromTo(point,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: constellations,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.5,
            },
          }
        );
      }

      // Dibujar líneas de constelación
      const canvas = document.createElement("canvas");
      canvas.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
      `;
      constellations.appendChild(canvas);

      const ctx2d = canvas.getContext("2d");
      const drawConstellations = () => {
        if (!ctx2d) return;
        const rect = constellations.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.strokeStyle = "rgba(161, 145, 119, 0.15)";
        ctx2d.lineWidth = 1;

        for (let i = 0; i < constellationPoints.length; i++) {
          const connections = Math.floor(gsap.utils.random(1, 3));
          for (let j = 0; j < connections; j++) {
            const target = Math.floor(gsap.utils.random(0, constellationPoints.length - 1));
            if (target !== i) {
              ctx2d.beginPath();
              ctx2d.moveTo(
                (constellationPoints[i].x / 100) * canvas.width,
                (constellationPoints[i].y / 100) * canvas.height
              );
              ctx2d.lineTo(
                (constellationPoints[target].x / 100) * canvas.width,
                (constellationPoints[target].y / 100) * canvas.height
              );
              ctx2d.stroke();
            }
          }
        }
      };

      drawConstellations();
      window.addEventListener("resize", drawConstellations);

      // 4. Título con efecto de curvatura espacio-temporal
      const titleLetters = title.querySelectorAll('.cosmic-char');

      titleLetters.forEach((letter, index) => {
        // Posición inicial curvada
        gsap.set(letter, {
          y: Math.sin(index * 0.3) * 100,
          x: Math.cos(index * 0.3) * 50,
          rotation: Math.sin(index * 0.2) * 30,
          scale: 0.5,
          opacity: 0,
          filter: "blur(15px)",
        });

        // Animación de llegada con curvatura
        gsap.to(letter, {
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 2,
          ease: "elastic.out(1, 0.3)",
          delay: index * 0.04,
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
            end: "top 50%",
            scrub: 0.7,
          },
        });

        // Flotación orbital
        gsap.to(letter, {
          y: Math.sin(index * 0.5 + Date.now() * 0.001) * 5,
          rotation: Math.sin(index * 0.3) * 2,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1,
        });
      });

      // 5. Nodos de información que orbitan
      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2;
        const radius = 250;

        gsap.set(node, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          opacity: 0,
          scale: 0,
        });

        // Entrada orbital
        gsap.to(node, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.6,
          },
        });

        // Rotación orbital continua
        gsap.to(node, {
          rotation: 360,
          duration: 20 + index * 5,
          repeat: -1,
          ease: "none",
        });

        // Efecto hover gravitacional
        node.addEventListener("mouseenter", () => {
          gsap.to(node, {
            scale: 1.2,
            boxShadow: "0 0 30px rgba(161, 145, 119, 0.5)",
            duration: 0.3,
            ease: "power2.out",
          });
        });

        node.addEventListener("mouseleave", () => {
          gsap.to(node, {
            scale: 1,
            boxShadow: "0 0 15px rgba(161, 145, 119, 0.2)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // 6. Nebulosas de fondo
      for (let i = 0; i < 4; i++) {
        const nebula = document.createElement("div");
        nebula.className = "cosmic-nebula";
        nebula.style.cssText = `
          position: absolute;
          width: ${gsap.utils.random(300, 500)}px;
          height: ${gsap.utils.random(300, 500)}px;
          background: radial-gradient(
            circle at center,
            rgba(161, 145, 119, ${gsap.utils.random(0.05, 0.15)}),
            rgba(138, 127, 110, ${gsap.utils.random(0.03, 0.08)}),
            transparent 70%
          );
          border-radius: 50%;
          left: ${gsap.utils.random(10, 70)}%;
          top: ${gsap.utils.random(10, 70)}%;
          filter: blur(${gsap.utils.random(30, 60)}px);
          opacity: 0;
        `;
        container.appendChild(nebula);

        gsap.fromTo(nebula,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 3,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "center center",
              scrub: 0.8,
            },
          }
        );

        // Movimiento de nebulosa
        gsap.to(nebula, {
          x: gsap.utils.random(-50, 50),
          y: gsap.utils.random(-50, 50),
          scale: gsap.utils.random(0.8, 1.3),
          duration: gsap.utils.random(8, 15),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 7. Rayos de luz que cruzan
      for (let i = 0; i < 5; i++) {
        const ray = document.createElement("div");
        ray.className = "light-ray";
        ray.style.cssText = `
          position: absolute;
          width: ${gsap.utils.random(1, 3)}px;
          height: ${gsap.utils.random(200, 400)}px;
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(161, 145, 119, 0.3), 
            rgba(196, 185, 168, 0.2), 
            transparent
          );
          left: ${gsap.utils.random(10, 90)}%;
          top: ${gsap.utils.random(-20, 60)}%;
          transform: rotate(${gsap.utils.random(-30, 30)}deg);
          opacity: 0;
          border-radius: 50%;
        `;
        container.appendChild(ray);

        gsap.fromTo(ray,
          {
            scaleY: 0,
            opacity: 0,
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.5,
            delay: i * 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.5,
            },
          }
        );

        // Oscilación de rayos
        gsap.to(ray, {
          x: gsap.utils.random(-20, 20),
          rotation: gsap.utils.random(-10, 10),
          opacity: gsap.utils.random(0.3, 0.8),
          duration: gsap.utils.random(4, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Limpiar canvas al desmontar
      return () => {
        window.removeEventListener("resize", drawConstellations);
      };

    }, container);

    return () => ctx.revert();
  }, []);

  const nodesInfo = [
    { title: "Gravedad", desc: "Curvatura espacial", symbol: "⊙" },
    { title: "Entrelazamiento", desc: "Conexión cuántica", symbol: "⧬" },
    { title: "Singularidad", desc: "Punto infinito", symbol: "◉" },
    { title: "Horizonte", desc: "Eventos límite", symbol: "◎" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-6xl overflow-hidden rounded-[40px]"
      style={{
        minHeight: "800px",
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000010 100%)",
      }}
    >
      {/* Campo de estrellas */}
      <div ref={starsRef} className="absolute inset-0" />

      {/* Nebulosas de fondo */}
      <div className="absolute inset-0 overflow-hidden" />

      {/* Hilos cósmicos */}
      <div ref={threadsRef} className="absolute inset-0 overflow-hidden" />

      {/* Constelaciones */}
      <div ref={constellationsRef} className="absolute inset-0" />

      {/* Contenido principal */}
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
        {/* Indicador de coordenadas */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#a19177] animate-pulse" />
            <span className="text-xs text-gray-400 uppercase tracking-[0.3em]" style={{ fontFamily: editorialFont }}>
              Coordenadas • Sector 7G
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c4b9a8] animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        {/* Título cósmico */}
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-8"
          style={{ fontFamily: editorialFont }}
        >
          {"TEJIDO CÓSMICO".split("").map((char, i) => (
            <span
              key={i}
              className="cosmic-char inline-block"
              style={{
                color: "white",
                textShadow: "0 0 30px rgba(161, 145, 119, 0.5), 0 0 60px rgba(196, 185, 168, 0.3)",
                display: "inline-block",
                width: char === " " ? "0.3em" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

        {/* Subtítulo */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a19177]/50 to-transparent" />
            <span className="text-sm text-gray-500 uppercase tracking-[0.2em]" style={{ fontFamily: editorialFont }}>
              Espacio-Tiempo Curvado
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a19177]/50 to-transparent" />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: editorialFont }}>
            Hilos de luz que conectan realidades a través del scroll
          </p>
        </div>

        {/* Nodos orbitales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {nodesInfo.map((node, index) => (
            <div
              key={index}
              ref={(el) => { nodesRef.current[index] = el; }}
              className="group relative cursor-pointer"
            >
              <div className="relative p-8 rounded-2xl bg-white/3 backdrop-blur-sm border border-white/10 hover:border-[#a19177]/50 transition-all duration-500"
                style={{
                  boxShadow: "0 0 20px rgba(161, 145, 119, 0.1)",
                }}
              >
                {/* Símbolo orbital */}
                <div className="text-5xl mb-6 text-center text-[#a19177]"
                  style={{
                    textShadow: "0 0 20px rgba(161, 145, 119, 0.5)",
                  }}
                >
                  {node.symbol}
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-3" style={{ fontFamily: editorialFont }}>
                  {node.title}
                </h3>
                <p className="text-sm text-gray-500 text-center" style={{ fontFamily: editorialFont }}>
                  {node.desc}
                </p>

                {/* Anillo orbital */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#a19177]/30 transition-all duration-500"
                  style={{
                    transform: "rotate(45deg)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Portal dimensional */}
        <div className="text-center relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a19177]/20"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  animation: `orbit ${3 + i}s linear infinite`,
                  animationDirection: i % 2 === 0 ? "normal" : "reverse",
                }}
              />
            ))}
          </div>

          <button
            className="group relative px-10 py-5 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 overflow-hidden transition-all duration-300 hover:border-[#a19177]/50 hover:bg-white/10 hover:scale-105 active:scale-95"
            style={{ fontFamily: editorialFont }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                boxShadow: "0 0 40px rgba(161, 145, 119, 0.4), 0 0 80px rgba(196, 185, 168, 0.2)",
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                boxShadow: "none",
                duration: 0.3,
                ease: "power2.out",
              });
            }}
          >
            <span className="relative z-10 text-white font-medium text-lg">
              Activar Portal Dimensional
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#a19177]/20 via-transparent to-[#c4b9a8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>

      {/* Indicador de frecuencia cósmica */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-[#a19177] to-transparent animate-pulse" />
          <span className="text-xs text-gray-600" style={{ fontFamily: editorialFont }}>
            432 Hz
          </span>
        </div>
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#a19177] to-transparent" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600" style={{ fontFamily: editorialFont }}>
            7.83 Hz
          </span>
          <div className="w-1 h-8 bg-gradient-to-t from-[#c4b9a8] to-transparent animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function GSAPCrystalTemporal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prismRef = useRef<HTMLDivElement>(null);
  const crystalGridRef = useRef<HTMLDivElement>(null);
  const facetsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lightBeamsRef = useRef<HTMLDivElement>(null);
  const timeMarkersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const prism = prismRef.current;
    const crystalGrid = crystalGridRef.current;
    const facets = facetsRef.current.filter(Boolean);
    const title = titleRef.current;
    const lightBeams = lightBeamsRef.current;
    const timeMarkers = timeMarkersRef.current;

    if (!container || !prism || !crystalGrid || !title || !lightBeams || !timeMarkers) return;

    const ctx = gsap.context(() => {
      // 1. Prisma central con refracción
      gsap.set(prism, {
        rotationX: 45,
        rotationY: 45,
        scale: 0.3,
        opacity: 0,
        filter: "blur(20px)",
      });

      const prismTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
        },
      });

      prismTimeline.to(prism, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "power4.out",
      });

      // Rotación continua sutil del prisma
      gsap.to(prism, {
        rotationY: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.3,
        },
      });

      // 2. Grid de cristal que se forma
      const crystalCells = crystalGrid.querySelectorAll('.crystal-cell');
      
      crystalCells.forEach((cell, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        
        gsap.set(cell, {
          scale: 0,
          rotation: gsap.utils.random(-90, 90),
          opacity: 0,
          filter: "blur(15px)",
        });

        gsap.to(cell, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: (row + col) * 0.05,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: crystalGrid,
            start: "top 90%",
            end: "top 20%",
            scrub: 0.6,
          },
        });

        // Brillo pulsante
        gsap.to(cell, {
          boxShadow: "0 0 20px rgba(161, 145, 119, 0.6), 0 0 40px rgba(196, 185, 168, 0.3)",
          duration: 2 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });

      // 3. Facetas que se revelan como diamante
      facets.forEach((facet, index) => {
        gsap.set(facet, {
          scale: 0,
          opacity: 0,
          rotation: gsap.utils.random(-45, 45),
        });

        gsap.to(facet, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          delay: index * 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: facets[index],
            start: "top 85%",
            end: "top 35%",
            scrub: 0.7,
          },
        });

        // Reflejo que se mueve
        gsap.to(facet, {
          backgroundPosition: "200% 200%",
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // 4. Título con efecto de refracción tipográfica
      const titleLetters = title.querySelectorAll('.crystal-char');
      
      titleLetters.forEach((letter, index) => {
        // Espectro de colores
        const hue = (index / titleLetters.length) * 60 + 20; // Rango de dorados
        
        gsap.set(letter, {
          y: 80,
          opacity: 0,
          scale: 0.5,
          filter: "blur(10px)",
          color: `hsl(${hue}, 30%, ${60 + (index % 3) * 15}%)`,
        });

        gsap.to(letter, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.8,
          delay: index * 0.04,
          ease: "power4.out",
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
            end: "top 45%",
            scrub: 0.8,
          },
        });

        // Micro-movimiento de refracción
        gsap.to(letter, {
          y: Math.sin(index * 0.8) * 3,
          x: Math.cos(index * 0.6) * 2,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.05,
        });
      });

      // 5. Haces de luz que atraviesan
      for (let i = 0; i < 8; i++) {
        const beam = document.createElement("div");
        beam.className = "light-beam";
        const angle = gsap.utils.random(-45, 45);
        const startPos = gsap.utils.random(0, 100);
        
        beam.style.cssText = `
          position: absolute;
          width: ${gsap.utils.random(100, 300)}px;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, ${gsap.utils.random(0.1, 0.3)}),
            rgba(196, 185, 168, ${gsap.utils.random(0.2, 0.5)}),
            rgba(255, 255, 255, ${gsap.utils.random(0.1, 0.3)}),
            transparent
          );
          left: ${startPos}%;
          top: ${gsap.utils.random(20, 80)}%;
          transform: rotate(${angle}deg);
          opacity: 0;
          filter: blur(1px);
        `;
        lightBeams.appendChild(beam);

        gsap.fromTo(beam,
          {
            scaleX: 0,
            opacity: 0,
          },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.5,
            delay: i * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.5,
            },
          }
        );

        // Oscilación de luz
        gsap.to(beam, {
          x: gsap.utils.random(-30, 30),
          y: gsap.utils.random(-20, 20),
          opacity: gsap.utils.random(0.3, 0.8),
          duration: gsap.utils.random(4, 7),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 6. Marcadores temporales
      const markers = timeMarkers.querySelectorAll('.time-marker');
      
      markers.forEach((marker, index) => {
        gsap.set(marker, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "left center",
        });

        gsap.to(marker, {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          delay: index * 0.25,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: timeMarkers,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.7,
          },
        });

        // Pulso del marcador
        const dot = marker.querySelector('.marker-dot');
        if (dot) {
          gsap.to(dot, {
            scale: 1.5,
            opacity: 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3,
          });
        }
      });

      // 7. Polvo de cristal flotante
      for (let i = 0; i < 30; i++) {
        const crystal = document.createElement("div");
        crystal.className = "crystal-dust";
        const size = gsap.utils.random(2, 6);
        
        crystal.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          left: ${gsap.utils.random(0, 100)}%;
          top: ${gsap.utils.random(0, 100)}%;
          opacity: 0;
          box-shadow: 0 0 ${size * 2}px rgba(196, 185, 168, 0.8);
        `;
        container.appendChild(crystal);

        gsap.fromTo(crystal,
          {
            scale: 0,
            opacity: 0,
            rotation: 0,
          },
          {
            scale: gsap.utils.random(0.5, 1.5),
            opacity: gsap.utils.random(0.2, 0.6),
            rotation: gsap.utils.random(-180, 180),
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "top 50%",
              scrub: 0.4,
            },
          }
        );

        // Flotación del polvo
        gsap.to(crystal, {
          y: gsap.utils.random(-100, 100),
          x: gsap.utils.random(-50, 50),
          rotation: gsap.utils.random(-360, 360),
          duration: gsap.utils.random(5, 12),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 3,
        });
      }

      // 8. Gradiente de refracción en el fondo
      const refractions = document.querySelectorAll('.refraction-layer');
      
      refractions.forEach((refraction, index) => {
        gsap.to(refraction, {
          backgroundPosition: `${100 + index * 50}% ${100 + index * 30}%`,
          duration: 10 + index * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.2,
          },
        });
      });

    }, container);

    return () => ctx.revert();
  }, []);

  const facetsData = [
    { title: "Claridad", value: "99.9%", color: "#2a2520" },
    { title: "Pureza", value: "VVS1", color: "#3a3530" },
    { title: "Talla", value: "Excellent", color: "#4a4540" },
    { title: "Quilates", value: "∞", color: "#5a5550" },
  ];

  const timeline = [
    { year: "2020", event: "Formación del Cristal" },
    { year: "2021", event: "Primera Refracción" },
    { year: "2022", event: "Expansión Prismática" },
    { year: "2023", event: "Cristalización Total" },
    { year: "2024", event: "Resonancia Lumínica" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mb-32 mt-10 max-w-6xl overflow-hidden rounded-[40px]"
      style={{
        minHeight: "800px",
        background: "linear-gradient(180deg, #0a0a0a 0%, #111111 30%, #0d0d0d 70%, #0a0a0a 100%)",
      }}
    >
      {/* Capas de refracción */}
      <div className="refraction-layer absolute inset-0 opacity-5"
        style={{
          background: "radial-gradient(circle at 30% 50%, #a19177 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="refraction-layer absolute inset-0 opacity-3"
        style={{
          background: "radial-gradient(circle at 70% 30%, #c4b9a8 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="refraction-layer absolute inset-0 opacity-4"
        style={{
          background: "radial-gradient(circle at 50% 70%, #8a7f6e 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Líneas de guía cristalográficas */}
      <div className="absolute inset-0 opacity-[0.02]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-full"
            style={{
              top: `${20 + i * 15}%`,
              background: `linear-gradient(90deg, transparent, white, transparent)`,
              transform: `rotate(${i % 2 === 0 ? 5 : -3}deg)`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
        {/* Prisma central */}
        <div className="flex justify-center mb-16" style={{ perspective: "1000px" }}>
          <div
            ref={prismRef}
            className="relative"
            style={{
              width: "120px",
              height: "120px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Caras del prisma */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-2xl border border-white/20"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(161, 145, 119, ${0.1 + i * 0.05}), 
                    rgba(196, 185, 168, ${0.05 + i * 0.03})
                  )`,
                  backdropFilter: "blur(10px)",
                  transform: `rotateY(${i * 60}deg) translateZ(60px)`,
                  boxShadow: "0 0 30px rgba(161, 145, 119, 0.2) inset",
                }}
              />
            ))}
            
            {/* Luz central */}
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: "translateZ(61px)",
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/80 animate-pulse"
                style={{
                  boxShadow: "0 0 20px white, 0 0 60px rgba(196, 185, 168, 0.6)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Título cristalográfico */}
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{ fontFamily: editorialFont }}
          >
            {"CRISTALOGRAFÍA".split("").map((char, i) => (
              <span
                key={i}
                className="crystal-char inline-block"
                style={{
                  display: "inline-block",
                  textShadow: "0 0 40px rgba(196, 185, 168, 0.4)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: editorialFont }}>
            La luz se descompone en infinitas posibilidades al atravesar el prisma del tiempo
          </p>
        </div>

        {/* Grid de cristal */}
        <div
          ref={crystalGridRef}
          className="grid grid-cols-5 gap-2 mb-16 max-w-md mx-auto opacity-40"
        >
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="crystal-cell aspect-square rounded"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(161, 145, 119, ${0.1 + (i % 5) * 0.02}), 
                  rgba(196, 185, 168, ${0.05 + (i % 3) * 0.02})
                )`,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 10px rgba(161, 145, 119, 0.2)",
                backdropFilter: "blur(5px)",
              }}
            />
          ))}
        </div>

        {/* Facetas de diamante */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {facetsData.map((facet, index) => (
            <div
              key={index}
              ref={(el) => { facetsRef.current[index] = el; }}
              className="group relative cursor-pointer"
            >
              <div
                className="relative p-8 rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${facet.color}11, ${facet.color}05)`,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  backgroundSize: "200% 200%",
                  backgroundPosition: "0% 0%",
                }}
              >
                {/* Brillo de faceta */}
                <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-all duration-500" />
                
                <div className="relative z-10">
                  <h3 className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-3" style={{ fontFamily: editorialFont }}>
                    {facet.title}
                  </h3>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: editorialFont }}>
                    {facet.value}
                  </p>
                </div>

                {/* Borde cristalino */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/20 transition-all duration-500"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Haces de luz */}
        <div ref={lightBeamsRef} className="relative h-32 mb-16" />

        {/* Timeline cristalográfico */}
        <div ref={timeMarkersRef} className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          
          {timeline.map((item, index) => (
            <div key={index} className="time-marker relative pl-20 pb-8 last:pb-0">
              {/* Punto marcador */}
              <div className="marker-dot absolute left-7 w-3 h-3 rounded-full bg-[#a19177]"
                style={{
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 10px #a19177, 0 0 20px #c4b9a8",
                }}
              />
              
              {/* Línea horizontal */}
              <div className="absolute left-10 top-1.5 w-6 h-px bg-gradient-to-r from-white/30 to-transparent" />
              
              {/* Contenido */}
              <div className="group cursor-pointer">
                <span className="text-xs text-[#a19177] tracking-[0.3em] uppercase" style={{ fontFamily: editorialFont }}>
                  {item.year}
                </span>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-[#c4b9a8] transition-colors duration-300" style={{ fontFamily: editorialFont }}>
                  {item.event}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Botón cristalino */}
        <div className="text-center mt-16">
          <button
            className="group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(161, 145, 119, 0.2), rgba(196, 185, 168, 0.1))",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: "rgba(196, 185, 168, 0.5)",
                boxShadow: "0 0 40px rgba(161, 145, 119, 0.3), 0 0 80px rgba(196, 185, 168, 0.1)",
                scale: 1.05,
                duration: 0.4,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "none",
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
              });
            }}
          >
            <span className="relative z-10 text-white font-medium" style={{ fontFamily: editorialFont }}>
              Iniciar Cristalización
            </span>
            {/* Brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Indicador de pureza */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-4 bg-gradient-to-b from-white to-transparent"
              style={{
                opacity: 0.3 + i * 0.15,
                transform: `rotate(${i * 2}deg)`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 tracking-[0.2em]" style={{ fontFamily: editorialFont }}>
          VVS1
        </span>
      </div>

      <style>{`
        @keyframes prism-rotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        .crystal-dust {
          animation: dust-float 6s ease-in-out infinite;
        }
        
        @keyframes dust-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -20px) rotate(90deg); }
          50% { transform: translate(-5px, -40px) rotate(180deg); }
          75% { transform: translate(-15px, -10px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}

// FIN PRUEBAS JOSE

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

  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsHeaderRef = useRef<HTMLDivElement>(null);
  const projectsTitleRef = useRef<HTMLHeadingElement>(null);
  const projectsTextRef = useRef<HTMLParagraphElement>(null);
  const projectsLineRef = useRef<HTMLDivElement>(null);
  const projectsCardsRef = useRef<HTMLDivElement[]>([]);

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
      {
        id: "api-utilities",
        title: "API Utilities",
        description:
          "Módulo visual estilo Swagger para documentar y probar utilidades API con React y Supabase. Incluye ejemplos de peticiones, respuestas JSON y estructura preparada para Edge Functions.",
        tags: ["React", "TypeScript", "Supabase", "API", "Swagger UI"],
        href: "/api-utilities",
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = projectsSectionRef.current;
    const header = projectsHeaderRef.current;
    const title = projectsTitleRef.current;
    const text = projectsTextRef.current;
    const line = projectsLineRef.current;
    const cards = projectsCardsRef.current;

    if (!section || !header || !title || !text || !line || cards.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(header, {
        y: 26,
        opacity: 0,
        filter: "blur(6px)",
      });

      gsap.set(title, {
        yPercent: 105,
        rotate: 1.2,
      });

      gsap.set(text, {
        y: 22,
        opacity: 0,
        filter: "blur(4px)",
      });

      gsap.set(line, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(cards, {
        y: 46,
        opacity: 0,
        scale: 0.985,
        filter: "blur(5px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 25%",
          scrub: 0.7,
        },
      });

      tl.to(header, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          title,
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .to(
          line,
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.45"
        )
        .to(
          text,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.65"
        )
        .to(
          cards,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4"
        );

      cards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -18 : -10,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [projects.length]);

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
          ref={projectsSectionRef}
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
            {/* PRUEBAS JOSE */}
            <GSAPScrollShowcase />

            <div className="h-20" />

            {/* Segundo efecto - Holográfico */}
            <GSAPHolographicReveal />

            <div className="h-20" />

            <GSAPGeometricDeconstruction />

            <div className="h-20" />

            <GSAPLiquidDimension />

            <div className="h-20" />

            <GSAPCosmicWeave />

            <div className="h-20" />

            <GSAPCrystalTemporal/>

            {/* FIN PRUEBAS JOSE */}
            <div
              ref={projectsHeaderRef}
              className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
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
                  <h2
                    ref={projectsTitleRef}
                    className="text-[clamp(1.9rem,4vw,3.25rem)] font-normal leading-tight text-[#171717]"
                    style={{ fontFamily: editorialFont }}
                  >
                    {page.projectsTitle}
                  </h2>
                </div>

                <div
                  ref={projectsLineRef}
                  className="mt-4 h-px bg-gradient-to-r from-[#b8ae9f] to-transparent"
                  style={{ maxWidth: "280px" }}
                />
              </div>

              <p
                ref={projectsTextRef}
                className="max-w-xl text-sm leading-[1.95] text-[#66615c]"
                style={{ fontFamily: editorialFont }}
              >
                {page.projectsSubtitle}
              </p>
            </div>

            <div className="grid gap-5">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    if (el) projectsCardsRef.current[index] = el;
                  }}
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    page={page}
                    focusOnWhite={focusOnWhite}
                  />
                </div>
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

