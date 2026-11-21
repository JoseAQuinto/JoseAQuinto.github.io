import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type TimelineStop = {
  id: string;
  kind: "education" | "internship" | "work" | "area";
  kindLabel: string;
  period?: string;
  title: string;
  place?: string;
  text?: string;
};

type HorizontalTimelineProps = {
  /** Cabecera de la sección: queda fija junto a la línea. */
  head: ReactNode;
  stops: readonly TimelineStop[];
  copy: {
    label: string;
    hint: string;
    scrollHint: string;
    today: string;
  };
};

type Metrics = {
  /** Recorrido horizontal necesario (px). */
  distance: number;
  /** Centro de cada punto, relativo a la pista (px). */
  dots: number[];
  /** Posición del cierre "Hoy". */
  end: number;
};

// Por debajo de esta altura útil la sección fija no cabe bien (p. ej. zoom
// al 200 % o móvil en horizontal): se usa la versión con scroll nativo.
const MIN_PINNED_HEIGHT = 560;
// Margen al principio y al final del tramo fijo en el que la línea no se
// mueve, para que entrar y salir no sea brusco.
const HOLD = 0.08;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function Stop({
  stop,
  index,
  lit,
}: {
  stop: TimelineStop;
  index: number;
  lit: MotionValue<number>;
}) {
  // lit = índice del último punto alcanzado por la línea.
  const state = useTransform(lit, (value) => (value >= index ? "on" : "off"));
  const [on, setOn] = useState(lit.get() >= index);
  useMotionValueEvent(state, "change", (value) => setOn(value === "on"));

  return (
    <li className={`pf-tl-stop pf-tl-stop--${stop.kind}`} data-on={on}>
      <p className="pf-tl-stop__period">{stop.period ?? " "}</p>
      <span className="pf-tl-stop__dot" aria-hidden="true" />
      <div className="pf-tl-card">
        <p className="pf-label pf-tl-card__kind">{stop.kindLabel}</p>
        <h3 className="pf-tl-card__title">{stop.title}</h3>
        {stop.place && <p className="pf-tl-card__place">{stop.place}</p>}
        {stop.text && <p className="pf-tl-card__text">{stop.text}</p>}
      </div>
    </li>
  );
}

/**
 * Línea temporal horizontal, del pasado al presente.
 *
 * Mientras se recorre, la sección queda fija (sticky) y el scroll vertical
 * solo mueve la línea en horizontal; al llegar a "Hoy", la página continúa.
 * La altura extra del contenedor es exactamente el recorrido horizontal.
 *
 * Con movimiento reducido o pantallas bajas se muestra como una franja con
 * scroll horizontal nativo, accesible con teclado.
 */
export default function HorizontalTimeline({
  head,
  stops,
  copy,
}: HorizontalTimelineProps) {
  const reduceMotion = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const metrics = useRef<Metrics>({ distance: 0, dots: [], end: 0 });
  // Las transformaciones de scroll leen siempre estos refs, nunca valores
  // capturados en un render anterior.
  const pinnedRef = useRef(false);
  const [pinned, setPinned] = useState(false);
  const [layout, setLayout] = useState({
    outerHeight: 0,
    stickyHeight: 0,
    lineLeft: 0,
    lineWidth: 0,
  });

  const measure = useCallback(() => {
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!sticky || !track) return;

    const header = document.querySelector<HTMLElement>(".pf-header");
    const headerHeight = header?.offsetHeight ?? 68;
    const usable = window.innerHeight - headerHeight;
    const canPin = !reduceMotion && usable >= MIN_PINNED_HEIGHT;

    const dots = Array.from(
      track.querySelectorAll<HTMLElement>(".pf-tl-stop__dot")
    ).map((dot) => {
      const stop = dot.parentElement as HTMLElement;
      return stop.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2;
    });
    const endCap = track.querySelector<HTMLElement>(".pf-tl-end");
    const end = endCap ? endCap.offsetLeft + 6 : dots[dots.length - 1] ?? 0;
    const distance = Math.max(0, track.scrollWidth - sticky.clientWidth);

    metrics.current = { distance, dots, end };
    const nextPinned = canPin && distance > 0;
    pinnedRef.current = nextPinned;
    setPinned(nextPinned);
    setLayout({
      // Altura de la zona fija + recorrido (con un pequeño margen de pausa).
      outerHeight: usable + distance / (1 - 2 * HOLD),
      stickyHeight: usable,
      lineLeft: dots[0] ?? 0,
      lineWidth: end - (dots[0] ?? 0),
    });
  }, [reduceMotion]);

  useLayoutEffect(() => {
    // Primera medida en el siguiente frame, con el layout ya calculado.
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (stickyRef.current) observer.observe(stickyRef.current);
    window.addEventListener("resize", measure);
    // Las fuentes cambian el ancho de las tarjetas al cargar.
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const { scrollY } = useScroll();

  // Progreso dentro del tramo fijo: 0 cuando la sección llega bajo la
  // cabecera, 1 cuando termina el recorrido.
  const scrollYProgress = useTransform(scrollY, (y) => {
    const outer = outerRef.current;
    if (!outer || !pinnedRef.current) return 1;
    const header = document.querySelector<HTMLElement>(".pf-header");
    const headerHeight = header?.offsetHeight ?? 68;
    const start = outer.getBoundingClientRect().top + y - headerHeight;
    const range = outer.offsetHeight - (window.innerHeight - headerHeight);
    return range > 0 ? clamp01((y - start) / range) : 1;
  });

  // Progreso horizontal 0–1 con pausa al principio y al final.
  const travel = useTransform(scrollYProgress, (value) =>
    pinnedRef.current ? clamp01((value - HOLD) / (1 - 2 * HOLD)) : 1
  );
  const x = useTransform(travel, (value) =>
    pinnedRef.current ? -value * metrics.current.distance : 0
  );
  // La línea ámbar avanza del primer punto a "Hoy".
  const fill = useTransform(travel, (value) => value);
  // Índice del último punto alcanzado (para encender puntos y tarjetas).
  const lit = useTransform(travel, (value) => {
    if (!pinnedRef.current) return Number.MAX_SAFE_INTEGER;
    const { dots, end } = metrics.current;
    if (!dots.length) return 0;
    const reached = dots[0] + value * (end - dots[0]);
    let index = 0;
    dots.forEach((position, i) => {
      if (position <= reached + 1) index = i;
    });
    return index;
  });

  return (
    <div
      ref={outerRef}
      className={`pf-tl${pinned ? " pf-tl--pinned" : ""}`}
      style={pinned ? { height: layout.outerHeight } : undefined}
    >
      <div
        ref={stickyRef}
        className="pf-tl__sticky"
        style={pinned ? { height: layout.stickyHeight } : undefined}
      >
        <div className="pf-wrap pf-tl__head">
          {head}
          <p className="pf-tl__hint" aria-hidden="true">
            {pinned ? copy.hint : copy.scrollHint}
          </p>
        </div>

        <div
          className="pf-tl__viewport"
          role="region"
          aria-label={copy.label}
          tabIndex={pinned ? undefined : 0}
        >
          <motion.div className="pf-tl__track" style={{ x }}>
            <div
              className="pf-tl__line"
              aria-hidden="true"
              style={{ left: layout.lineLeft, width: layout.lineWidth }}
            >
              <motion.span className="pf-tl__fill" style={{ scaleX: fill }} />
            </div>
            <ol ref={trackRef} className="pf-tl__list">
              {stops.map((stop, index) => (
                <Stop key={stop.id} stop={stop} index={index} lit={lit} />
              ))}
              <li className="pf-tl-end">
                <span className="pf-tl-end__dot" aria-hidden="true" />
                <span className="pf-tl-end__label">{copy.today}</span>
              </li>
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
