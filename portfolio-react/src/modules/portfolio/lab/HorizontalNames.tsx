import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * Efecto F: los nombres de los portfolios en tipografía grande cruzan la
 * pantalla en horizontal siguiendo el scroll (no es un carrusel automático:
 * si dejas de bajar, se detienen). Dos filas en sentidos opuestos.
 */
export default function HorizontalNames({ names }: { names: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xA = useTransform(scrollYProgress, [0, 1], ["5%", "-45%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-45%", "5%"]);

  const row = [...names, ...names, ...names];

  return (
    <div ref={ref} className="lab-marquee" aria-hidden="true">
      <motion.p className="lab-marquee__row" style={reduceMotion ? undefined : { x: xA }}>
        {row.map((name, index) => (
          <span key={index} className={index % 2 ? "lab-marquee__outline" : undefined}>
            {name}
          </span>
        ))}
      </motion.p>
      <motion.p
        className="lab-marquee__row lab-marquee__row--small"
        style={reduceMotion ? undefined : { x: xB }}
      >
        {row.map((name, index) => (
          <span key={index} className={index % 2 ? undefined : "lab-marquee__outline"}>
            {name}
          </span>
        ))}
      </motion.p>
    </div>
  );
}
