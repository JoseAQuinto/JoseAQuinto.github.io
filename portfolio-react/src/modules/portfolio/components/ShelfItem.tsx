import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type ShelfItemProps = {
  /** Posición en la lista: alterna el lado desde el que entra. */
  index: number;
  as?: "li" | "div";
  className?: string;
  /** Muestra la marca ámbar lateral que se rellena al colocarse. */
  marker?: boolean;
  /** Recorrido horizontal en px. */
  distance?: number;
  children: ReactNode;
};

/**
 * Efecto "estantería": cada elemento entra desde un lado (alternando) y se
 * coloca en su sitio siguiendo el scroll, como una caja que se empuja a su
 * hueco. Va ligado al scroll: si se sube, se deshace. Con movimiento
 * reducido se muestra quieto.
 */
export default function ShelfItem({
  index,
  as = "li",
  className,
  marker = false,
  distance = 90,
  children,
}: ShelfItemProps) {
  // Sirve tanto para <li> como para <div>.
  const ref = useRef<HTMLLIElement & HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.6"],
  });
  const from = index % 2 === 0 ? -distance : distance;
  const x = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.15, 0.75, 1]);
  const fill = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  const Tag = as === "div" ? motion.div : motion.li;

  return (
    <Tag
      ref={ref}
      className={`pf-shelf${className ? ` ${className}` : ""}`}
      style={reduceMotion ? undefined : { x, opacity }}
    >
      {marker && (
        <motion.span
          className="pf-shelf__marker"
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : fill }}
        />
      )}
      {children}
    </Tag>
  );
}
